import React from 'react';
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider';
import { FlexLayout, H2, Icon } from '../src';
import { ThemeStateContext } from '@deity/falcon-theme-editor';

const ThemePreview: React.SFC<any> = ({ of }) => {
  const themeKey = Object.keys(of.defaultProps.defaultTheme);
  return (
    <ThemeStateContext>
      {({ setActiveComponent }) => (
        <FlexLayout css={{ cursor: 'pointer' }} onClick={() => setActiveComponent(of.defaultProps)}>
          <Icon fill="secondary" size={40} src="editor" />
          <H2 css={{ fontSize: 24 }}>Edit {themeKey} theme</H2>
        </FlexLayout>
      )}
    </ThemeStateContext>
  );
};

export default withMDXComponents(ThemePreview);
