export type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export type BaseTask = {
  title: string;
  completed: boolean;
};

export type CreateTaskDTO = BaseTask;

export type UpdateTaskDTO = Partial<BaseTask>;
