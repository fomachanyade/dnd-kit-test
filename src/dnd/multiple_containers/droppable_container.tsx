import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type DroppableContainerProps = {
	id: UniqueIdentifier;
	items: UniqueIdentifier[];
	children: React.ReactNode;
	style?: React.CSSProperties;
};

export const DroppableContainer = (props: DroppableContainerProps) => {
	const { id, items, children, style } = props;
	const {
		active,
		attributes,
		isDragging,
		listeners,
		over,
		setNodeRef,
		transition,
		transform,
	} = useSortable({
		id,
		data: {
			type: "container",
			children: items,
		},
	});

	const isOverContainer = over
		? (id === over.id && active?.data.current?.type !== "container") ||
		  items.includes(over.id)
		: false;

	return (
		<div
			ref={setNodeRef}
			style={{
				...style,
				border: "1px solid #ccc",
				padding: 16,
				margin: 16,
				transition,
				transform: CSS.Translate.toString(transform),
				opacity: isDragging ? 0.5 : undefined,
				backgroundColor: isOverContainer ? "#f1f1f1" : undefined,
			}}
			{...attributes}
			{...listeners}
		>
			{children}
		</div>
	);
};
