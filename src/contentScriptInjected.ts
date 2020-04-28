import { iFrameURL } from 'src/constants';

const chromeOnSteroidsIframeContainer = document.getElementById(
  'chrome-on-steroids-iframe-container'
);

if (chromeOnSteroidsIframeContainer === null) {
  localStorage.setItem(
    'chromeOnSteroidsBodyStyleOverflow',
    document.body.style.overflow
  );

  document.body.style.overflow = 'hidden';

  const chromeOnSteroidsRootElement = document.createElement('div');

  chromeOnSteroidsRootElement.setAttribute(
    'style',
    'z-index: 2147483647; position: fixed; top: 0; left: 0;  margin: 0;  padding: 0; width: 100vw; height: 100vh; background-color: transparent; transition: background-color 0.2s ease-in;'
  );

  chromeOnSteroidsRootElement.id = 'chrome-on-steroids-iframe-container';
  const iFrame = document.createElement('iframe');
  iFrame.setAttribute(
    'style',
    'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none;'
  );
  iFrame.src = iFrameURL;
  chromeOnSteroidsRootElement.append(iFrame);

  document.body.insertAdjacentElement(
    'afterbegin',
    chromeOnSteroidsRootElement
  );

  setTimeout(() => {
    chromeOnSteroidsRootElement.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  }, 0);
} else {
  chromeOnSteroidsIframeContainer.remove();

  const chromeOnSteroidsBodyStyleOverflow = localStorage.getItem(
    'chromeOnSteroidsBodyStyleOverflow'
  );

  document.body.style.overflow = chromeOnSteroidsBodyStyleOverflow;
}
