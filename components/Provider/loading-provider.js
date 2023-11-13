'use client';
import React from 'react';
import { Next13ProgressBar } from 'next13-progressbar';

export default function LoadingProviders({ children }) {
  return (
    <>
        <Next13ProgressBar height="2.5px" options={{ showSpinner: false }} color="#FD6F22"/>
        {children}
    </>
  );
};
