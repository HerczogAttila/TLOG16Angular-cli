import { Task } from './task';

export class WorkDay {
    public requiredMinPerDay: number;
    public extraMinPerDay: number;
    public sumMinPerDay: number;
    public dayOfMonth: number;
    public date: string;
    public tasks: Task[];
}
