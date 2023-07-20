import { TextField } from "@mui/material";
import { Icon } from "../Icon";
import classNames from "classnames";
import { useMemo } from "react";
import { debounce } from "lodash";

const PathFilter: React.FC<{ onFilterTextChange: (value: string) => void; className?: string }> = ({
  onFilterTextChange,
  className
}) => {
  const onFilterTextChange_ = useMemo(
    () =>
      debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterTextChange(e.target.value);
      }, 500),
    [onFilterTextChange]
  );
  return (
    <div className={classNames("flex-row-nowrap items-end", className)}>
      <Icon icon="mdi:filter" className="text-2xl m-1" />
      <TextField
        label="Filter by path"
        className="flex-1 whitespace-nowrap overflow-hidden"
        variant="standard"
        onChange={onFilterTextChange_}
      />
    </div>
  );
};

export default PathFilter;
