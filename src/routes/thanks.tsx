import pageMeta from '@/seo';

export const meta = pageMeta({
  title: 'Supporters - Aral Roca',
  canonical: '/thanks',
});

export default function Supporters() {
  return (
    <div class="supporters">
      <div class="support-head">
        <h1>Support</h1>
        <a href="#donate" role="button" class="donate-btn">
          Donate 🧡
        </a>
      </div>

      <p class="description">
        Thank you for making my Open-Source work possible.{' '}
        <u>You're awesome!</u>
      </p>

      <h2>Sponsors list 🙏</h2>

      <h3>Open-Source Top Supporters</h3>
      <ul>
        <li>
          <a href="https://github.com/taehee-ww" target="_blank" rel="noopener">
            Taehee Kim (비행토끼)
          </a>
        </li>
      </ul>

      <h3>Open-Source Supporters</h3>
      <ul>
        <li>
          <a href="https://github.com/phanan" target="_blank" rel="noopener">
            Phan An
          </a>
        </li>
        <li>
          <a href="https://github.com/rkalis" target="_blank" rel="noopener">
            Rosco Kalis
          </a>
        </li>
        <li>
          <a
            href="https://github.com/DanTehrani"
            target="_blank"
            rel="noopener"
          >
            Daniel Tehrani
          </a>
        </li>
      </ul>

      {/*}

      <h3>🌕 Platinum</h3>
      <em>None.</em>

      <h3>🌖 Gold</h3>
      <em>None.</em>

      <h3>🌗 Silver</h3>
      <em>None.</em>

      <h3>🌘 Bronze</h3>
      <em>None.</em>

      <h2>Supporters list</h2>
      <h3>Top Supporters</h3>
      <em>None.</em>


      <h3>Supporters</h3>
      <em>None.</em> */}

      <hr class="wrapper-separator" />
      <h2 id="donate">Donate</h2>
      <p>
        Few years ago I realized that I wanted to be useful and now, with your
        support, I'll be able to focus on contributing as much as possible to
        the Open-Source community. Thank you so much ♥️
      </p>
      <a
        href="https://github.com/sponsors/aralroca"
        target="_blank"
        rel="noopener noreferrer"
      >
        Read more about me and what I do
      </a>

      <div class="donate-wrapper">
        <div>
          <h2>Monthly donations</h2>
          <ul>
            <li>
              <a
                href="https://github.com/sponsors/aralroca"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Sponsors
              </a>
            </li>
            <li>
              <a
                href="https://www.patreon.com/aralroca"
                target="_blank"
                rel="noopener noreferrer"
              >
                Patreon
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2>One-time donations</h2>
          <ul>
            <li>
              <a
                href="https://www.buymeacoffee.com/aralroca"
                target="_blank"
                rel="noopener noreferrer"
              >
                BuyMeACoffee.com
              </a>
            </li>
            <li>
              <a
                href="https://ko-fi.com/aralroca"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ko-fi.com
              </a>
            </li>
            <li>
              <a
                href="https://www.paypal.me/aralroca"
                target="_blank"
                rel="noopener noreferrer"
              >
                PayPal
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
