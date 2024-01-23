import { forwardRef } from "react";

export type ItemProps = {
	id: number;
};
export const Item = forwardRef<HTMLDivElement, ItemProps>(
	({ id, ...props }, ref) => {
		return (
			<div style={{ margin: 10 }} {...props} ref={ref}>
				{id}
			</div>
		);
	},
);
