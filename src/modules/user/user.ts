import {
    Model, Schema, model
} from 'mongoose';
import TimeStampPlugin, {
    ITimeStampedDocument
} from '../../lib/plugins/timestamp-plugin';
import { ITask } from '../task';
import Task from '../task/task';

export interface IUser extends ITimeStampedDocument {
    name: string;
    email: string;
    password: string;
    salt: string;
    tokenVersion: number;
    tasks: ITask[];
}
  
export interface IUserModel extends Model<IUser> { }
  
export const UserSchema = new Schema<IUser>({
    name: { type: String, index: true, required: true },
    email: { type: String, index: true, required: true, unique: true },
    password: { type: String, index: true, required: true },
    salt: { type: String, index: true, required: true },
    tokenVersion: { type: Number, required: true, default: 1 },
    tasks : [ { type: Schema.Types.ObjectId, ref:'Task', required: false } ]
}, {
    toObject: {
        transform: function(doc, ret) {},
    },
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.tokenVersion;
        }
    }
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
UserSchema.plugin(TimeStampPlugin);
// Delete user tasks after delete
UserSchema.pre('remove', async function(next) {
    await Task.remove({user: this._id})
    next();
})

const User: IUserModel = model<IUser, IUserModel>('User', UserSchema);
  
export default User;
