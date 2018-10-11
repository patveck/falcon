import React from 'react';
import { Box, Portal, ThemedComponentPropsWithVariants } from '@deity/falcon-ui';

function throttle(callback: Function, wait: number, context: Object) {
  let timeout: number | undefined;
  let callbackArgs: any[];

  const later = () => {
    callback.apply(context, callbackArgs);
    timeout = undefined;
  };

  return (...args: any[]) => {
    if (!timeout) {
      callbackArgs = args;
      timeout = window.setTimeout(later, wait);
    }
  };
}

type ComponentLocatorState = {
  locatedComponent?: {
    rect: ClientRect;
    defaultTheme: ThemedComponentPropsWithVariants;
  };
};

type ComponentLocatorProps = {
  onClick?: (
    component: {
      defaultTheme: ThemedComponentPropsWithVariants;
    }
  ) => void;
};

function getNearestThemableComponentForElement(el: Element) {
  const maxElementHierarchyTraversal = 3;
  let currentTraversal = 0;
  let elementToCheck: Element | null = el;

  while (currentTraversal < maxElementHierarchyTraversal) {
    if (!elementToCheck) return;

    // based on https://stackoverflow.com/a/50204915/105206
    for (const key in elementToCheck) {
      if (key.startsWith('__reactInternalInstance$')) {
        const fiberNode = (elementToCheck as any)[key];
        const component = fiberNode && fiberNode._debugOwner;
        const defaultTheme = component && component.memoizedProps && component.memoizedProps.defaultTheme;
        if (defaultTheme) {
          return {
            defaultTheme: defaultTheme as ThemedComponentPropsWithVariants,
            rect: elementToCheck.getBoundingClientRect() as ClientRect
          };
        }
      }
    }

    elementToCheck = elementToCheck.parentElement;
    currentTraversal++;
  }

  return;
}

// based on https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
function getHashCode(val: string) {
  var hash = 0;
  if (val.length == 0) return hash;
  for (var i = 0; i < val.length; i++) {
    hash = val.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return hash;
}

function getHSLA(hash: number) {
  var shortened = hash % 360;
  return 'hsla(' + shortened + ', 90%, 30%, 0.2)';
}

export class ComponentLocator extends React.Component<ComponentLocatorProps, ComponentLocatorState> {
  readonly state: ComponentLocatorState = {};

  throttledOnChange?: Function = undefined;
  currentElementFromPoint?: Element = undefined;

  componentDidMount() {
    this.throttledOnChange = throttle(this.onChange, 50, this);
    window.addEventListener('mousemove', this.throttledOnChange as any);
    window.addEventListener('click', this.onClick);
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.throttledOnChange as any);
    window.removeEventListener('click', this.onClick);
    window.addEventListener('scroll', this.onScroll);
    this.currentElementFromPoint = undefined;
    this.throttledOnChange = undefined;
  }

  onChange(e: MouseEvent) {
    let elementFromPoint = document.elementFromPoint(e.clientX, e.clientY);
    if (!elementFromPoint) return;
    if (this.currentElementFromPoint === elementFromPoint) return;

    this.currentElementFromPoint = elementFromPoint;
    const nearestThemableComponent = getNearestThemableComponentForElement(this.currentElementFromPoint);

    requestAnimationFrame(() => {
      this.setState({
        locatedComponent: nearestThemableComponent
      });
    });
  }

  onClick = () => {
    if (!this.props.onClick) return;
    if (!this.state.locatedComponent) return;

    this.props.onClick({
      defaultTheme: this.state.locatedComponent.defaultTheme
    });
  };

  onScroll = () => {
    if (!this.state.locatedComponent) return;
    this.setState({
      locatedComponent: undefined
    });
  };

  renderOverlay() {
    const { locatedComponent } = this.state;
    if (!locatedComponent) return null;

    const themeKey = Object.keys(locatedComponent.defaultTheme)[0];

    return (
      <Box
        position="absolute"
        style={{
          left: locatedComponent.rect.left,
          right: locatedComponent.rect.right,
          top: locatedComponent.rect.top,
          bottom: locatedComponent.rect.bottom,
          height: locatedComponent.rect.height,
          width: locatedComponent.rect.width,
          backgroundColor: getHSLA(getHashCode(themeKey))
        }}
      >
        <Box bg="black" position="absolute" bottom="100%" fontSize="sm" px="sm" py="xs" color="white">
          {themeKey}
        </Box>
      </Box>
    );
  }

  render() {
    return (
      <Portal>
        <Box position="fixed" top="0" left="0" height="100%" width="100%" css={{ pointerEvents: 'none' }}>
          {this.renderOverlay()}
        </Box>
      </Portal>
    );
  }
}
