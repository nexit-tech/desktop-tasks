export interface TaskNode {
  id: string;
  text: string;
  done: boolean;
  collapsed: boolean;
  children: TaskNode[];
  color?: string;
  dueDate?: string;
  createdAt?: string;
  archived?: boolean;
}

export interface AppConfig {
  bgColor: string;
  opacity: number;
  theme?: string;
  accentColor?: string;
}