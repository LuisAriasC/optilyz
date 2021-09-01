import {
    Model, Schema, model
} from 'mongoose';
import TimeStampPlugin, {
    ITimeStampedDocument
} from '../../lib/plugins/timestamp-plugin';
import { IUser } from '../user';
  
export interface ITask extends ITimeStampedDocument {
    /** Name of the task */
    description: string;
    /** Finish time of the task */
    finishTime: number;
    /** Reminder of notification  time of the task */
    notificationTime: number;
    /** Flag for task completion */
    isCompleted: boolean;
    /** Owner of the task */
    user: IUser;
}
  
interface ITaskModel extends Model<ITask> { }
  
const schema = new Schema<ITask>({
    description: { type: String, index: true, required: true },
    finishTime: { type: Number, index: true, required: true },
    notificationTime: { type: Number, index: true, required: true },
    isCompleted: { type: Boolean, index: true, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true }
}, {
    toObject: {
        transform: function(doc, ret) {}
    },
    toJSON: {
        transform: function(doc, ret) {
            //ret.user.toJSON()
        }
    }
});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);
  
const Task: ITaskModel = model<ITask, ITaskModel>('Task', schema);
  
export default Task;
