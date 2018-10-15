import { Theme, createTheme, mergeThemes, ThemedComponentPropsWithVariants } from '@deity/falcon-ui';
import React from 'react';

type ComponentWithDefaultTheme = {
  defaultTheme: ThemedComponentPropsWithVariants;
};

type ThemeStateContextType = {
  setActiveComponent?: (component: ComponentWithDefaultTheme) => void;
  openEditor?: boolean;
};

export const ThemeStateContext = React.createContext<ThemeStateContextType>({});

type ThemeStateState = {
  activeTheme: Theme;
  activeComponent?: ComponentWithDefaultTheme;
  openEditor?: boolean;
};

type ChildrenRenderProp = {
  theme: Theme;
  initialTheme?: Theme;
  updateTheme: (themeDiff: Partial<Theme>, useInitial: any) => void;
  activeComponent?: ComponentWithDefaultTheme;
  setActiveComponent?: (component: ComponentWithDefaultTheme) => void;
  openEditor?: boolean;
  toggleEditor: () => void;
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

  setActiveComponent = (component: ComponentWithDefaultTheme) => {
    this.setState({
      activeComponent: component,
      openEditor: true
    });
  };
  toggleEditor = () => {
    this.setState(state => ({ openEditor: !state.openEditor }));
  };

  render() {
    return (
      <ThemeStateContext.Provider value={{ setActiveComponent: this.setActiveComponent }}>
        {this.props.children({
          theme: this.state.activeTheme,
          updateTheme: this.updateTheme,
          initialTheme: this.props.initial,
          activeComponent: this.state.activeComponent,
          setActiveComponent: this.setActiveComponent,
          openEditor: this.state.openEditor,
          toggleEditor: this.toggleEditor
        })}
      </ThemeStateContext.Provider>
    );
  }
}
