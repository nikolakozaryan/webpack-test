import * as $ from "jquery";

interface Analytics {
  destroy(): void;
  getClicks(): number | string;
}

function createAnalytics(): Analytics {
  let counter: number = 0;
  let isDestroyed: boolean = false;

  const listener = (): number => counter++;

  $(document).on("click", listener);

  return {
    destroy() {
      $(document).off("click", listener);
      isDestroyed = true;
    },

    getClicks() {
      if (isDestroyed) {
        return `Analytics is destroyed. Total clicks = ${counter}`;
      }
      return counter;
    },
  };
}

window['analytics'] = createAnalytics();
