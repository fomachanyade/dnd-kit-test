import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

export const Droppable = (props: { id: string; children: ReactNode }) => {
	const { id, children } = props;

	const { isOver, setNodeRef } = useDroppable({
		id,
	});
	const style = {
		color: isOver ? "green" : undefined,
	};

	return (
		<div ref={setNodeRef} style={style}>
			{children}
		</div>
	);
};
