const _getElementById = async (id: string): Promise<HTMLElement> => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(document.getElementById(id));
    }, 100);
  });
};

export const getElementById = async (id: string, maxCounter = 5): Promise<HTMLElement> => {
  let element = undefined;
  for (let index = 0; index < maxCounter; index++) {
    if (!element) {
      element = await _getElementById(id);
    }
  }
  return element;
};

const _getElementByClassFirst = async (classId: string): Promise<HTMLElement> => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(document.getElementsByClassName(classId)[0] as HTMLElement);
    }, 100);
  });
};

export const getElementByClassFirst = async (classId: string, maxCounter = 5): Promise<HTMLElement> => {
  let element = undefined;
  for (let index = 0; index < maxCounter; index++) {
    if (!element) {
      element = await _getElementByClassFirst(classId);
    }
  }
  return element;
};

export const getFirstParentElementByAttribute = (elem, att, value) => {
  for (; elem && elem !== document; elem = elem.parentNode) {
    const attVal = elem.getAttribute(att);
    if (attVal === value) return elem;
  }
  return null;
};

export const getFirstParentElementByClass = (element: any, classId: string) => {
  for (; element && element !== document; element = element.parentNode) {
    if ((' ' + element.className + ' ').indexOf(' ' + classId + ' ') > -1) {
      return element;
    }
  }
  return null;
};
