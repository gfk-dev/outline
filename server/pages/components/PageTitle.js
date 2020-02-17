// @flow
import * as React from 'react';
import { Helmet } from 'react-helmet';

function PageTitle({ title }: { title: string }) {
  return (
    <Helmet>
      <title>{title} – QuezX Documentation</title>
    </Helmet>
  );
}

export default PageTitle;
