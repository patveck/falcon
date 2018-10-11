import React from 'react';
import {
  Theme,
  mappings,
  ThemedComponentPropsWithVariants,
  mergeThemes,
  Box,
  Dropdown,
  DropdownLabel,
  DropdownMenu,
  DropdownMenuItem,
  GridLayout,
  ResponsivePropMapping
} from '@deity/falcon-ui';
import { themeMeta } from './thememeta';

function keys<O>(o: O) {
  return Object.keys(o) as (keyof O)[];
}

export const ComponentEditor: React.SFC<{
  theme: Theme;
  defaultThemeProps: ThemedComponentPropsWithVariants;
  themeProps?: ThemedComponentPropsWithVariants;
  onChange: (key: string, value: string) => void;
}> = ({ defaultThemeProps, themeProps, theme, onChange }) => {
  const mergedProps = mergeThemes(
    defaultThemeProps as any,
    (themeProps || {}) as any
  ) as ThemedComponentPropsWithVariants;

  return (
    <Box>
      {keys(mappings)
        .filter(mapping => mergedProps[mapping] !== undefined)
        .map((prop: keyof typeof mappings) => {
          const themeProp = (mappings[prop] as ResponsivePropMapping).themeProp;

          if (themeProp) {
            return (
              <GridLayout key={prop} gridTemplateColumns="80px 1fr" mb="md" alignItems="center">
                <Box>{prop}</Box>
                <Dropdown onChange={value => onChange(value.key, value.value)}>
                  <DropdownLabel width="100%" pl="lg">
                    <GridLayout gridTemplateColumns="80px 1fr">
                      <Box>{mergedProps[prop]}</Box>
                      {themeMeta[themeProp] &&
                        (themeMeta[themeProp] as any).previewCss && (
                          <Box
                            justifySelf="end"
                            bg="primaryLight"
                            border="light"
                            borderColor="primaryDark"
                            width={20}
                            height={20}
                            css={(themeMeta[themeProp] as any).previewCss(
                              (theme[themeProp] as any)[(mergedProps as any)[prop]]
                            )}
                          />
                        )}
                    </GridLayout>
                  </DropdownLabel>
                  <DropdownMenu>
                    {keys(theme[themeProp]).map(key => (
                      <DropdownMenuItem
                        key={key}
                        value={{ key: prop, value: key }}
                        px="lg"
                        color={key === mergedProps[prop] ? 'secondaryText' : 'primaryText'}
                        bg={key === mergedProps[prop] ? 'secondary' : 'transparent'}
                      >
                        <GridLayout gridTemplateColumns="80px 1fr">
                          <Box>{key}</Box>
                          {themeMeta[themeProp] &&
                            (themeMeta[themeProp] as any).previewCss && (
                              <Box
                                justifySelf="end"
                                bg="primaryLight"
                                border="light"
                                borderColor="primaryDark"
                                width={20}
                                height={20}
                                css={(themeMeta[themeProp] as any).previewCss(theme[themeProp][key])}
                              />
                            )}
                        </GridLayout>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </GridLayout>
            );
          }
          return null;
        })}
    </Box>
  );
};
