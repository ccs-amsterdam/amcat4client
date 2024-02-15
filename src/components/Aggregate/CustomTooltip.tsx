import React from "react";
import { TooltipProps } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

export const CustomTooltip = ({ active, payload, label, ...props }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const sorted = payload.sort((p1, p2) => (Number(p2?.value) || 0) - (Number(p1?.value) || 0));

    const items = sorted.slice(0, 5).map((p) => ({ name: p.name, value: p.value, color: p.color }));
    const others = sorted.length - items.length;
    return (
      <div className="rounded-md border-[1px] border-gray-400 bg-background/90 p-3">
        <h3 className="mb-2 text-base font-bold">{label}</h3>
        <div className="grid grid-cols-[auto,1fr,1fr] items-center">
          {items.map((item) => {
            return (
              <React.Fragment key={item.name}>
                <div
                  className="h-3 w-3 rounded-full border-[1px] border-black "
                  style={{ background: item.color }}
                ></div>
                <span className="pl-2 pr-5 font-semibold">{item.name}</span>
                <span>{item.value}</span>
              </React.Fragment>
            );
          })}
        </div>
        {others > 0 ? <div className="mt-1  italic">({others} others)</div> : null}
      </div>
    );
  }
};
