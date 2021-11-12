import { IconActionItem } from "@/commands/types";
import { IconButton } from "@material-ui/core";
import { useMemo } from "react";
import { Icon } from "../Icon";

const RowActionButtons: React.VFC<{
  size: number;
  actions?: readonly IconActionItem[];
}> = ({ size, actions }) => {
  const buttons = useMemo(
    () =>
      (actions || []).map((a) => {
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (!a.disabled) {
            a.handler();
          }
        };
        return (
          <IconButton
            key={a.id}
            className="p-1 my-auto hover:bg-highlight"
            style={{ maxWidth: size, maxHeight: size }}
            disabled={a.disabled}
            title={a.label}
            onClick={handleClick}
          >
            <Icon icon={a.icon!} />
          </IconButton>
        );
      }),
    [size, actions]
  );
  if (!actions) {
    return <></>;
  }
  return (
    <div className="mx-1 flex-row-nowrap items-center invisible max-w-0 group-hover:visible group-hover:max-w-none">
      {buttons}
    </div>
  );
};

export default RowActionButtons;
