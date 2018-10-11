import React from 'react';

import {
  H4,
  RangeInput,
  Input,
  Text,
  Details,
  Summary,
  DetailsContent,
  ThemeProvider,
  Box,
  NumberInput,
  GridLayout,
  Group,
  Button,
  Dropdown,
  DropdownLabel,
  DropdownMenu,
  DropdownMenuItem,
  H2,
  Divider,
  DefaultThemeProps,
  H3,
  createTheme,
  FlexLayout,
  Icon
} from '@deity/falcon-ui';

import { availablePresets } from './presets';
import { fonts } from './fonts';
import { ThemeSidebar } from './ThemeSidebar';
import { ComponentEditor } from './ComponentEditor';
import { ComponentLocator } from './ComponentLocator';

export * from './ThemeState';
export * from './thememeta';

const categories = {
  colors: {
    name: 'Colors',
    themeMappings: [
      {
        themeProps: 'colors',
        input: 'color'
      }
    ]
  },

  spacing: {
    name: 'Spacing',
    themeMappings: [
      {
        themeProps: 'spacing',
        input: 'number',
        min: 0,
        step: 1,
        max: 100
      }
    ]
  },

  fonts: {
    name: 'Typography',
    themeMappings: [
      {
        themeProps: 'fonts',
        input: 'dropdown',
        options: fonts
      },
      {
        themeProps: 'fontSizes',
        input: 'number',
        min: 0,
        step: 1,
        max: 80
      },
      {
        themeProps: 'fontWeights',
        input: 'text'
      },
      {
        themeProps: 'lineHeights',
        input: 'number',
        min: 0,
        step: 0.1,
        max: 3
      },
      {
        themeProps: 'letterSpacings',
        input: 'text'
      }
    ]
  },
  breakpoints: {
    name: 'Breakpoints',
    themeMappings: [
      {
        themeProps: 'breakpoints',
        input: 'number',
        step: 1,
        min: 0,
        max: 2048
      }
    ]
  },
  borders: {
    name: 'Borders',
    themeMappings: [
      {
        themeProps: 'borders',
        input: 'text'
      },
      {
        themeProps: 'borderRadius',
        input: 'number',
        min: 0,
        step: 1,
        max: 100
      }
    ]
  },
  misc: {
    name: 'Miscellaneous',
    themeMappings: [
      {
        themeProps: 'boxShadows',
        input: 'text'
      },
      {
        themeProps: 'easingFunctions',
        input: 'text'
      },
      {
        themeProps: 'transitionDurations',
        input: 'text'
      }
    ]
  }
};

const editorTheme = createTheme({
  components: {
    summary: {
      bg: 'primaryLight'
    }
  },
  icons: {
    locator: {
      icon: (props: any) => (
        <svg viewBox="0 0 100 125" {...props}>
          <polygon points="72.5,52.5 72.5,47.5 52.5,47.5 52.5,27.5 47.5,27.5 47.5,47.5 27.5,47.5 27.5,52.5 47.5,52.5 47.5,72.5 52.5,72.5    52.5,52.5  " />
          <polygon points="90,90 65,90 65,95 90,95 95,95 95,90 95,65 90,65  " />
          <polygon points="90,5 65,5 65,10 90,10 90,35 95,35 95,10 95,5  " />
          <polygon points="10,10 35,10 35,5 10,5 5,5 5,10 5,35 10,35  " />
          <polygon points="10,65 5,65 5,90 5,95 10,95 35,95 35,90 10,90  " />
        </svg>
      ),
      css: {
        cursor: 'pointer'
      }
    }
  } as any
});

export class ThemeEditor extends React.Component<any, any> {
  state = {
    openPanels: {},
    sidebarVisible: false,
    selectedTheme: 0,
    componentLocator: false,
    activeComponent: undefined
  };

  onChange = (themeKey: string, propName: string, isNumber?: boolean) => (e: any) => {
    this.props.updateTheme({
      [themeKey]: {
        [propName]: isNumber ? +e.target.value : e.target.value
      }
    });
  };

  onFontChange = (fontKind: string) => (fontOption: any) => {
    this.props.updateTheme({
      fonts: {
        [fontKind]: fontOption.value
      }
    });

    if (fontOption.google) {
      this.loadGoogleFont(fontOption.google);
    }
  };

  onPresetChange = (presetIndex: number) => () => {
    if (presetIndex === this.state.selectedTheme) {
      return;
    }

    this.setState({
      selectedTheme: presetIndex
    });

    requestAnimationFrame(() => {
      this.props.updateTheme(availablePresets[presetIndex].theme, { useInitial: true });
    });

    if (!(availablePresets[presetIndex] as any).theme.fonts) {
      return;
    }
    const newFont = (availablePresets[presetIndex] as any).theme.fonts.sans;

    const potentiallFontToLoad = fonts.filter(font => font.value === newFont)[0];

    if (potentiallFontToLoad && potentiallFontToLoad.google) {
      this.loadGoogleFont(potentiallFontToLoad.google);
    }
  };

  onComponentThemeChange = (themeKey: string, variantKey?: string) => (key: string, value: string) => {
    if (variantKey) {
      this.props.updateTheme({
        components: {
          [themeKey]: {
            variants: {
              [variantKey]: {
                [key]: value
              }
            }
          }
        }
      });
    } else {
      this.props.updateTheme({
        components: {
          [themeKey]: {
            [key]: value
          }
        }
      });
    }
  };

  onComponentClick = (component: any) => {
    this.setState({
      activeComponent: component,
      componentLocator: false
    });
  };

  loadGoogleFont(font: string) {
    // require is inline as webfontloader does not work server side
    // https://github.com/typekit/webfontloader/issues/383
    const WebFontLoader = require('webfontloader');

    WebFontLoader.load({
      google: {
        families: [font]
      }
    });
  }

  toggleSidebar = () => {
    this.setState((state: any) => ({ sidebarVisible: !state.sidebarVisible }));
  };

  toggleCollapsible = (key: string) => (e: any) => {
    e.preventDefault();

    this.setState((state: any) => {
      const openPanels = { ...state.openPanels };

      openPanels[key] = !openPanels[key];
      return {
        openPanels
      };
    });
  };

  toggleComponentLocator = () => {
    this.setState((state: any) => ({
      componentLocator: !state.componentLocator
    }));
  };

  renderEditor(themeMapping: any) {
    const { theme } = this.props;

    return (
      <React.Fragment>
        {Object.keys(theme[themeMapping.themeProps]).map(themeProp => (
          <GridLayout
            alignItems="center"
            gridGap="xs"
            mb="sm"
            gridTemplateColumns={themeMapping.input === 'dropdown' ? '50px auto 1.8fr 20px' : '1.2fr auto 1.8fr 20px'}
            key={themeMapping.themeProps + themeProp}
          >
            <H4 p="xs">{themeProp}</H4>

            {!themeMapping.step && (
              <Box gridColumn={!themeMapping.step ? 'span 3' : ''}>
                {themeMapping.input === 'dropdown' && (
                  <Dropdown onChange={this.onFontChange(themeProp)}>
                    <DropdownLabel>{theme[themeMapping.themeProps][themeProp]}</DropdownLabel>

                    <DropdownMenu>
                      {themeMapping.options.map((option: any) => (
                        <DropdownMenuItem key={option.value} value={option}>
                          {`${option.value} ${option.google ? ' - (Google Font)' : ''}`}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                )}

                {themeMapping.input !== 'dropdown' && (
                  <Input
                    onChange={this.onChange(themeMapping.themeProps, themeProp)}
                    type={themeMapping.input}
                    value={theme[themeMapping.themeProps][themeProp]}
                    css={() => {
                      if (themeMapping.input === 'color') {
                        return {
                          padding: 0,
                          width: 60,
                          borderRadius: 0,
                          border: 'none'
                        };
                      }

                      return {};
                    }}
                  />
                )}
              </Box>
            )}
            {themeMapping.step && (
              <React.Fragment>
                <NumberInput
                  gridColumn={!themeMapping.step ? 'span 3' : ''}
                  value={theme[themeMapping.themeProps][themeProp]}
                  min={themeMapping.min}
                  max={themeMapping.max}
                  step={themeMapping.step}
                  onChange={this.onChange(themeMapping.themeProps, themeProp, true)}
                />

                <RangeInput
                  defaultValue={theme[themeMapping.themeProps][themeProp]}
                  min={themeMapping.min}
                  max={themeMapping.max}
                  step={themeMapping.step}
                  onChange={this.onChange(themeMapping.themeProps, themeProp, true)}
                />
                <Text p="none" ml="xs" fontSize="sm">
                  px
                </Text>
              </React.Fragment>
            )}
          </GridLayout>
        ))}
      </React.Fragment>
    );
  }

  renderActiveComponentEditor() {
    const activeComponent = this.state.activeComponent as
      | {
          defaultTheme: DefaultThemeProps;
        }
      | undefined;

    if (!activeComponent) return null;

    const themeKey = Object.keys(activeComponent.defaultTheme)[0];

    return (
      <Box>
        <Divider my="md" />
        <H3 mb="md" css={{ textAlign: 'center' }}>
          {themeKey} theme
        </H3>

        <ComponentEditor
          defaultThemeProps={activeComponent.defaultTheme[themeKey]}
          themeProps={this.props.theme.components[themeKey]}
          theme={this.props.theme}
          onChange={this.onComponentThemeChange(themeKey)}
        />

        {activeComponent.defaultTheme[themeKey].variants && (
          <Box>
            {Object.keys((activeComponent.defaultTheme[themeKey] as any).variants).map(variantKey => (
              <React.Fragment>
                <H3 css={{ textAlign: 'center' }} fontSize="md" my="md">
                  {variantKey} variant
                </H3>
                <ComponentEditor
                  defaultThemeProps={(activeComponent.defaultTheme[themeKey] as any).variants[variantKey]}
                  themeProps={
                    this.props.theme.components[themeKey] &&
                    this.props.theme.components[themeKey].variants &&
                    this.props.theme.components[themeKey].variants[variantKey]
                  }
                  theme={this.props.theme}
                  onChange={this.onComponentThemeChange(themeKey, variantKey)}
                />
              </React.Fragment>
            ))}
          </Box>
        )}
      </Box>
    );
  }

  render() {
    return (
      <ThemeProvider theme={editorTheme} withoutRoot>
        <ThemeSidebar open={this.state.sidebarVisible} toggle={this.toggleSidebar}>
          <GridLayout
            p="sm"
            gridTemplateColumns="minmax(280px, 380px)"
            gridAutoRows="min-content"
            css={{ overflow: 'auto' }}
          >
            <H2 my="xs" css={{ textAlign: 'center' }}>
              Theme Editor
            </H2>
            <Divider mb="md" />
            <FlexLayout>
              <Box title="Select themed component to inspect it's theme">
                <Icon
                  src="locator"
                  onClick={this.toggleComponentLocator}
                  fill={this.state.componentLocator ? 'secondary' : 'black'}
                />
              </Box>
            </FlexLayout>
            <Divider mb="md" />
            <Details key="presets" open={(this.state.openPanels as any)['presets']}>
              <Summary onClick={this.toggleCollapsible('presets')}>Presets</Summary>
              <DetailsContent>
                <Group my="md" mx="md" display="flex">
                  {availablePresets.map((preset, index) => (
                    <Button
                      key={preset.name}
                      variant={index === this.state.selectedTheme ? '' : 'secondary'}
                      flex="1"
                      onClick={this.onPresetChange(index)}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </Group>
              </DetailsContent>
            </Details>

            {Object.keys(categories).map(categoryKey => {
              const category = (categories as any)[categoryKey];
              return (
                <Details key={category.name} open={(this.state.openPanels as any)[categoryKey]}>
                  <Summary onClick={this.toggleCollapsible(categoryKey)}>{category.name}</Summary>

                  {(this.state.openPanels as any)[categoryKey] && (
                    <DetailsContent>
                      {category.themeMappings.length === 1
                        ? this.renderEditor(category.themeMappings[0])
                        : category.themeMappings.map((themeMapping: any) => {
                            const key = category.name + themeMapping.themeProps;

                            return (
                              <Details mb="sm" key={key} open={(this.state.openPanels as any)[key]}>
                                <Summary onClick={this.toggleCollapsible(key)}>{themeMapping.themeProps}</Summary>
                                <DetailsContent>{this.renderEditor(themeMapping)}</DetailsContent>
                              </Details>
                            );
                          })}
                    </DetailsContent>
                  )}
                </Details>
              );
            })}

            {this.renderActiveComponentEditor()}
          </GridLayout>
        </ThemeSidebar>
        {this.state.componentLocator && <ComponentLocator onClick={this.onComponentClick} />}
      </ThemeProvider>
    );
  }
}
