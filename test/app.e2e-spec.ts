import  request from 'supertest';
import { init } from './fixtures';
import mongoose from 'mongoose';
import app from '../src/app';

describe('User Controller (mongoose - e2e)', () => {
  
  let db: mongoose.Mongoose;
  let accessToken: string = '';
  let createdUserId: string = '';
  let taskId: string = '';

  beforeAll(async () => {
    db = await mongoose.connect('mongodb://localhost:27017/optyliz');
    await init();
  });

  describe('Signup', () => {
    it('Should allow sign up of a new user', async () => {
      await request(app)
       .post('/signup')
       .send({
         name: 'Test User 2',
         email: 'test.user2@mail.com',
         password: 'password_123'
       })
       .expect(200)
       .then(({body}) => {
         expect(body.code).toEqual('success');
         expect(body.data.accessToken).toEqual(expect.any(String));
         expect(body.data.user._id).toEqual(expect.any(String));
         expect(body.data.user.name).toEqual('Test User 2');
         expect(body.data.user.email).toEqual('test.user2@mail.com');
       });
    })
  });

  describe('Login', () => {
    it('Should allow user log in', async () => {
      await request(app)
       .post('/login')
       .send({
         email: 'test.user@mail.com',
         password: 'test_password'
       })
       .expect(200)
       .then(({body}) => {
         expect(body.code).toEqual('success');
         expect(body.data.accessToken).toEqual(expect.any(String));
         accessToken = body.data.accessToken;
         expect(body.data.user._id).toEqual(expect.any(String));
         expect(body.data.user.name).toEqual('Test User');
         expect(body.data.user.email).toEqual('test.user@mail.com');
       });
    })
  });

  describe('Users', () => {
    it('Should allow create new user', async () => {
      await request(app)
       .post(`/user`)
       .set('token', `${accessToken}`)
       .send({
         name: 'Created User',
         email: 'created@mail.com',
         password: 'created_password'
       })
       .expect(200)
       .then(({body}) => {
         expect(body.code).toEqual('success');
         expect(body.data.user._id).toEqual(expect.any(String));
         createdUserId = body.data.user._id;
         expect(body.data.user.name).toEqual('Created User');
         expect(body.data.user.email).toEqual('created@mail.com');
       });
    });

    it('Should allow read user', async () => {
      await request(app)
       .get(`/user/${createdUserId}`)
       .set('token', `${accessToken}`)
       .send()
       .expect(200)
       .then(({body}) => {
         expect(body.code).toEqual('success');
         expect(body.data.user._id).toEqual(expect.any(String));
         expect(body.data.user.name).toEqual('Created User');
         expect(body.data.user.email).toEqual('created@mail.com');
       });
    })

    it('Should allow update user', async () => {
      await request(app)
       .put(`/user/${createdUserId}`)
       .set('token', `${accessToken}`)
       .send({
         name: 'Createded'
       })
       .expect(200)
       .then(({body}) => {
         expect(body.code).toEqual('success');
         expect(body.data.user._id).toEqual(expect.any(String));
         expect(body.data.user.name).toEqual('Created User');
         expect(body.data.user.email).toEqual('created@mail.com');
       });
    });

    it('Should allow get all users', async () => {
      await request(app)
       .get(`/users`)
       .set('token', `${accessToken}`)
       .send()
       .expect(200)
       .then(({ body }) => {
        expect(body.code).toEqual('success');
        body.data.users.map((user: any) => {
          expect(user._id).toEqual(expect.any(String));
          expect(user.name).toEqual(expect.any(String));
          expect(user.email).toEqual(expect.any(String));
        })
       });
    });

    it('Should allow delete one user', async () => {
      await request(app)
       .delete(`/user/${createdUserId}`)
       .set('token', `${accessToken}`)
       .send()
       .expect(200)
       .then(({ body }) => {
        expect(body.code).toEqual('success');
       });
    });
  });

  describe('Tasks', () => {
    it('Should allow create new task', async () => {
      await request(app)
       .post(`/task`)
       .set('token', `${accessToken}`)
       .send({
         description: 'First Task',
         finishTime: 1629937778450,
         notificationTime: 1629997778450,
         user: `${createdUserId}`,
       })
       .expect(200)
       .then(({body}) => {
         expect(body.code).toEqual('success');
         expect(body.data.task._id).toEqual(expect.any(String));
         taskId = body.data.task._id;
         expect(body.data.task.description).toEqual('First Task');
         expect(body.data.task.finishTime).toEqual(1629937778450);
         expect(body.data.task.notificationTime).toEqual(1629997778450);
         expect(body.data.task.isCompleted).toEqual(false);
         expect(body.data.task.user).toEqual(`${createdUserId}`);
       });
    });

    it('Should allow read a task', async () => {
      await request(app)
       .get(`/task/${taskId}`)
       .set('token', `${accessToken}`)
       .send()
       .expect(200)
       .then(({body}) => {
        expect(body.data.task._id).toEqual(taskId);
        expect(body.data.task.description).toEqual('First Task');
        expect(body.data.task.finishTime).toEqual(1629937778450);
        expect(body.data.task.notificationTime).toEqual(1629997778450);
        expect(body.data.task.isCompleted).toEqual(false);
        expect(body.data.task.user).toEqual(`${createdUserId}`);
       });
    })

    it('Should allow update a task', async () => {
      await request(app)
       .put(`/task/${taskId}`)
       .set('token', `${accessToken}`)
       .send({
         description: 'Created Task'
       })
       .expect(200)
       .then(({body}) => {
         expect(body.code).toEqual('success');
         expect(body.data.task._id).toEqual(taskId);
         expect(body.data.task.description).toEqual('First Task');
         expect(body.data.task.finishTime).toEqual(1629937778450);
         expect(body.data.task.notificationTime).toEqual(1629997778450);
         expect(body.data.task.isCompleted).toEqual(false);
         expect(body.data.task.user).toEqual(`${createdUserId}`);
       });
    });

    it('Should allow get all tasks', async () => {
      await request(app)
       .get(`/tasks`)
       .set('token', `${accessToken}`)
       .send()
       .expect(200)
       .then(({ body }) => {
        expect(body.code).toEqual('success');
        body.data.tasks.map((task: any) => {
          expect(task._id).toEqual(expect.any(String));
          expect(task.description).toEqual(expect.any(String));
          expect(task.finishTime).toEqual(expect.any(Number));
          expect(task.notificationTime).toEqual(expect.any(Number));
          expect(task.isCompleted).toEqual(expect.any(Boolean));
          expect(task.user).toEqual(expect.any(String));
        })
       });
    });

    it('Should allow delete one task', async () => {
      await request(app)
       .delete(`/task/${taskId}`)
       .set('token', `${accessToken}`)
       .send()
       .expect(200)
       .then(({ body }) => {
        expect(body.code).toEqual('success');
       });
    });
  });

  afterAll(async () => {
    await db.connection.db.dropDatabase();
    await db.disconnect();
  });
});