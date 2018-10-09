import { Theme, createTheme, mergeThemes } from '@deity/falcon-ui';
import React from 'react';

type ThemeStateState = {
  activeTheme: Theme;
};

type ChildrenRenderProp = {
  theme: Theme;
  updateTheme: (themeDiff: Partial<Theme>, useInitial: any) => void;
};

type ThemeStateProps = {
  initial?: Theme;
  children: (renderProp: ChildrenRenderProp) => React.ReactNode;
};

export class ThemeState extends React.Component<ThemeStateProps, ThemeStateState> {
  constructor(props: ThemeStateProps) {
    super(props);
    this.state = {
      activeTheme: props.initial || createTheme()
    };
  }

  updateTheme = (themeDiff: Partial<Theme>, { useInitial = false }: { useInitial?: boolean } = {}) => {
    requestAnimationFrame(() => {
      this.setState(state => {
        const themeBase = useInitial ? this.props.initial || createTheme() : state.activeTheme;

        return {
          activeTheme: mergeThemes(themeBase, themeDiff)
        };
      });
    });
  };

  render() {
    return this.props.children({
      theme: this.state.activeTheme,
      updateTheme: this.updateTheme
    });
  }
}
