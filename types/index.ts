export interface TaskNode {
  id: string;
  text: string;
  done: boolean;
  collapsed: boolean;
  children: TaskNode[];
  color?: string;
  dueDate?: string;
}

export interface AppConfig {
  bgColor: string;
  opacity: number;
}