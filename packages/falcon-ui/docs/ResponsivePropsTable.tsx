import React from 'react';
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider';
import { withCSSContext } from '@emotion/core';
import { mappings, ResponsivePropMapping } from '../src/theme/responsiveprops';
import { Table, Thead, Tr, Th, Tbody, Td, Theme, Box, H3, H1 } from '../src';
import { themeCategories, themeMeta } from '@deity/falcon-theme-editor';
const mappingKeys = Object.keys(mappings);

const toKebabCase = (val: string) => val.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const ResponsiveProps: React.SFC<{ theme: Theme; category: keyof typeof themeCategories }> = ({ theme, category }) => (
  <Box>
    <H1>{themeCategories[category].name}</H1>

    {themeCategories[category].themeSections.map(section => (
      <React.Fragment>
        {themeCategories[category].themeSections.length > 1 && <H3>{section}</H3>}
        <Table mb="xl">
          <Thead>
            <Tr>
              <Th>Property</Th>
              <Th>Meaning(CSS property)</Th>
            </Tr>
          </Thead>

          <Tbody>
            {mappingKeys.filter(name => (mappings[name] as ResponsivePropMapping).themeProp === section).map(name => {
              const prop: ResponsivePropMapping = mappings[name];
              const cssProp = prop.cssProp || (!prop.transformToCss ? name : '');

              return (
                <Tr key={name}>
                  <Td>{name}</Td>

                  <Td>
                    {cssProp && toKebabCase(cssProp)}
                    {!cssProp && (
                      <Box color="secondary" title={prop.transformToCss.toString()}>
                        transform function
                      </Box>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>

        <H3 mb="md" fontWeight="regular">
          Allowed values
        </H3>

        <Table mb="xl">
          <Thead>
            <Tr>
              <Th>Property Value</Th>
              <Th>Meaning (CSS property value)</Th>
              {themeMeta[section].previewCss && <Th>Preview</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {Object.keys(theme[section]).map(key => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  {theme[section][key]} {themeMeta[section].unit}
                </Td>

                {themeMeta[section].previewCss && (
                  <Td>
                    <Box
                      bg="primaryDark"
                      border="light"
                      borderColor="black"
                      width={30}
                      height={30}
                      css={themeMeta[section].previewCss(theme[section][key])}
                    />
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </React.Fragment>
    ))}
  </Box>
);

export default withMDXComponents(
  withCSSContext((props: any, context: any) => <ResponsiveProps theme={context.theme} {...props} />)
);
