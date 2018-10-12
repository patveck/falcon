import React from 'react';
import { diff } from 'deep-object-diff';
import stringifyObject from 'stringify-object';

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      ),
      css: {
        cursor: 'pointer',
        fill: 'none'
      }
    },
    download: {
      icon: (props: any) => (
        <svg viewBox="0 0 24 24" {...props}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      ),
      css: {
        cursor: 'pointer',
        fill: 'none'
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

  downloadThemeCustomizations = () => {
    const themeCustomizations = diff(this.props.initialTheme, this.props.theme);
    const importString = "import { createTheme } from '@deity/falcon-ui';";
    const data = `data:text/json;charset=utf-8,${encodeURIComponent(
      `${importString}\n\nexport const theme = createTheme(${stringifyObject(themeCustomizations, { indent: '  ' })});`
    )}`;

    const downloader = document.createElement('a');

    downloader.setAttribute('href', data);
    downloader.setAttribute('download', 'theme.js');
    downloader.click();
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
            <FlexLayout justifyContent="space-around">
              <Box css={{ textAlign: 'center' }} title="Select themed component to inspect it's theme">
                <Icon
                  src="locator"
                  onClick={this.toggleComponentLocator}
                  stroke={this.state.componentLocator ? 'secondary' : 'black'}
                />
                <Text fontSize="xs">Component Locator</Text>
              </Box>
              <Box css={{ textAlign: 'center' }} title="Download theme customizations">
                <Icon src="download" stroke="black" onClick={this.downloadThemeCustomizations} />
                <Text fontSize="xs">Download Customizations</Text>
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
