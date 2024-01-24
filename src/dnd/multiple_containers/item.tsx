import { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from '@dnd-kit/utilities';
import { forwardRef } from 'react';
import styled from "styled-components";

const ItemWrapper = styled.div<{dragOverLay:boolean}>`
    display: flex;
    box-sizing: border-box;
    transform: translate3d(30, 30, 0), 0)
    scaleX(0.3) scaleY(0.3);
    transform-origin: 0 0;
    touch-action: manipulation;
    ${({dragOverLay})=>dragOverLay && `
        --scale: 1.05;
        --box-shadow: 0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15);
        --box-shadow-picked-up:  0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05),
            -1px 0 15px 0 rgba(34, 33, 81, 0.01),
            0px 15px 15px 0 rgba(34, 33, 81, 0.25);
        z-index: 999;
    `}
`;

export type ItemProps ={
    value: React.ReactNode;
    dragOverlay?: boolean;
    transition?: string | null;
    transform?: Transform | null;
    listeners?: DraggableSyntheticListeners;
    fadeIn?: boolean;
}

export const Item = forwardRef<HTMLDivElement, ItemProps>(
    (props,ref)=> {
    const { value, dragOverlay = false, transition, transform, listeners, fadeIn} = props;
  
    return (
      <ItemWrapper
        ref={ref}
        dragOverLay={dragOverlay}
        style={{
          transition: transition || undefined,
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scaleX}, ${transform.scaleY})`
            : undefined,
          opacity: fadeIn ? 0.5 : undefined,
        }}
        {...listeners}
      >
        {value}
      </ItemWrapper>
    );
  });