import { component, enums, intent, schema } from 'janux';

type Pref = 'system' | 'dark' | 'light';

function applyTheme(pref: Pref) {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const mode = pref === 'system' ? (dark ? 'dark' : 'light') : pref;

  document.body.className = mode;
  document.body.dataset.themePref = pref;
  localStorage.setItem('theme', pref);
  syncTwitterEmbeds(mode);
}

/** Tweets embedded in posts carry their own theme; keep them in sync. */
function syncTwitterEmbeds(mode: string) {
  document
    .querySelector('meta[name="twitter:widgets:theme"]')
    ?.setAttribute('content', mode);
  document
    .querySelectorAll<HTMLIFrameElement>('iframe[src]')
    .forEach((iframe) => {
      if (!iframe.src.startsWith('https://platform.twitter.com')) return;
      if (!iframe.src.includes('theme=')) iframe.src += `&theme=${mode}`;
      else
        iframe.src = iframe.src.replace(/theme=(dark|light)/g, `theme=${mode}`);
    });
}

export const ChangeTheme = component({
  name: 'change-theme',
  description: 'Color theme of the site: system, dark or light.',

  state: schema({ pref: enums(['system', 'dark', 'light']).default('system') }),

  intents: {
    set: intent({
      description: 'Choose the color theme. The change persists across visits.',
      input: schema({ value: enums(['system', 'dark', 'light']) }),
      run: ({ state, input }: any) => {
        state.pref = input.value;
        applyTheme(input.value);
      },
    }),
  },

  view: ({ state, intents }: any) => (
    <label for="theme" class="change-theme">
      <DarkSVG />
      <LightSVG />
      <SystemSVG />
      <select
        title="Choose another theme"
        aria-label="Choose another theme"
        onChange={intents.set}
        id="theme"
      >
        <option selected={state.pref === 'system'} value="system">
          System
        </option>
        <option selected={state.pref === 'dark'} value="dark">
          Dark
        </option>
        <option selected={state.pref === 'light'} value="light">
          Light
        </option>
      </select>
      <script
        dangerHTML={
          "var s=document.getElementById('theme');if(s)s.value=localStorage.getItem('theme')||'system'"
        }
      />
    </label>
  ),
});

function DarkSVG() {
  return (
    <svg
      aria-hidden="true"
      class="theme-icon theme-icon-dark"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      shape-rendering="geometricPrecision"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
    </svg>
  );
}

function LightSVG() {
  return (
    <svg
      aria-hidden="true"
      class="theme-icon theme-icon-light"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      shape-rendering="geometricPrecision"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <path d="M12 1v2"></path>
      <path d="M12 21v2"></path>
      <path d="M4.22 4.22l1.42 1.42"></path>
      <path d="M18.36 18.36l1.42 1.42"></path>
      <path d="M1 12h2"></path>
      <path d="M21 12h2"></path>
      <path d="M4.22 19.78l1.42-1.42"></path>
      <path d="M18.36 5.64l1.42-1.42"></path>
    </svg>
  );
}

function SystemSVG() {
  return (
    <svg
      aria-hidden="true"
      class="theme-icon theme-icon-system"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      shape-rendering="geometricPrecision"
    >
      <path d="M2 13.381h20M8.66 19.05V22m6.84-2.95V22m-8.955 0h10.932M4 19.05h16a2 2 0 002-2V4a2 2 0 00-2-2H4a2 2 0 00-2 2v13.05a2 2 0 002 2z"></path>
    </svg>
  );
}
