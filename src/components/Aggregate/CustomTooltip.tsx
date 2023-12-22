import React from "react";
import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

export const CustomTooltip = ({
  active,
  payload,
  label,
  ...props
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const sorted = payload.sort(
      (p1, p2) => (Number(p2?.value) || 0) - (Number(p1?.value) || 0)
    );

    const items = sorted
      .slice(0, 5)
      .map((p) => ({ name: p.name, value: p.value, color: p.color }));
    const others = sorted.length - items.length;
    return (
      <div className="bg-[#fffb] rounded-md p-3 border-[1px] border-gray-400">
        <h3 className="font-bold text-base mb-2">{label}</h3>
        <div className="grid grid-cols-[auto,1fr,1fr] items-center">
          {items.map((item) => {
            return (
              <React.Fragment key={item.name}>
                <div
                  className="rounded-full h-3 w-3 border-[1px] border-black "
                  style={{ background: item.color }}
                ></div>
                <span className="pr-5 pl-2 font-semibold">{item.name}</span>
                <span>{item.value}</span>
              </React.Fragment>
            );
          })}
        </div>
        {others > 0 ? (
          <div className="italic  mt-1">({others} others)</div>
        ) : null}
      </div>
    );
  }
};
