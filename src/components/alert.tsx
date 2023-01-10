import { Alert as CloudscapeAlert } from "@cloudscape-design/components";

export type AlertType = 'info' | 'warning' | 'error' | 'success';
export interface AlertObj {
  expired: number;
  title: string;
  content: string;
  type: AlertType;
}

export type AlertObjs = Array<AlertObj>;

export interface AlertProps {
  objs: AlertObjs;
}

const Alert = (props: AlertProps) => {
  return (
    <>
      {props.objs.filter((obj) => obj !== null).map(obj => {
        return (
          <CloudscapeAlert
            key={obj!.expired}
            type={obj!.type}
            header={obj!.title}
          >
            {obj!.content}
          </CloudscapeAlert>
        );
      })}
    </>
  );
};

export { Alert };
