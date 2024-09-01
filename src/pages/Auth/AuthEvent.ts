import { eventApi } from '../../api/eventApi';
import { db } from '../../db/db';
import { privateApi } from '../../api/privateApi';
import { authApi } from '../../api/authApi';
import { RegisterData } from '../../types';

export const eventSet = async () => {
  try {
    const eventData = await eventApi.getAll();
    const revision = await eventApi.revision();
    const pRevision = await privateApi.revision();
    if (eventData.status === 200 && revision.status === 200 && pRevision.status === 200) {
      await db.open();
      await db.transaction('rw', db.event, db.private, async () => {
        // すでにDBが作られている場合エラーになってしまうため、そのエラーを無視させる
        try {
          await db.event.bulkAdd(eventData.data.events);
        } catch (error) {
          if ((error as Error).name === 'BulkError') {
            console.warn('ConstraintError: Key already exists in the object store.');
          } else {
            throw error;
          }
        }
      });
      // リビジョンを保存
      localStorage.setItem('revision', revision.data.revision);
      localStorage.setItem('revision-private', pRevision.data.revision);
    } else {
      throw new Error(`event init failed: event=${eventData.status}, revision=${revision.status}`);
    }
  } catch (err) {
    console.log(err);
  }
};

// DBに新規登録するためのAPIを叩く
export const dbRegister = async (data: RegisterData) => {
  try {
    const res = await authApi.register(data);
    if (res.status === 200) {
      return true;
    } else if (res.status === 409) {
      alert('すでに登録されているためログインします');
      return true;
    } else {
      return false;
    }
  } catch (err) {
    alert('登録に失敗しました。\nサポートへお問い合わせください。');
    console.log(err);
  }
};
