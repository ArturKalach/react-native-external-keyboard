import React, { FunctionComponent, ReactElement } from 'react';

export type RenderProp =
  | ReactElement
  | FunctionComponent
  | (() => ReactElement);

export const RenderPropComponent = ({ render }: { render: RenderProp }) => {
  if (React.isValidElement(render)) {
    return render;
  } else if (typeof render === 'function') {
    const Component = render;
    return <Component />;
  } else {
    return null;
  }
};
