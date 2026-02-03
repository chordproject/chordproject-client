import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'help-center-guide',
  imports: [MatButton, MatIcon, RouterLink],
  template: `
    <div
      class="@container mx-auto flex w-full max-w-4xl flex-auto flex-col items-start p-6 pt-2 lg:p-10 lg:pt-16"
    >
      <!-- Header -->
      <a
        matButton
        class="-ml-3"
        routerLink="/admin/help-center"
      >
        <mat-icon svgIcon="move-left" />
        Back to Help Center
      </a>

      <div class="relative mt-3 flex flex-col">
        <div class="text-xl font-bold tracking-tighter sm:text-4xl">
          Getting Started
        </div>
      </div>

      <!-- Body -->
      <article class="prose">
        <p class="lead">
          This is a guide to the various components that make up a typical
          article page. It includes examples of all the standard HTML elements
          you are likely to need when writing content.
        </p>

        <h2>Header Level 2</h2>
        <p>
          <strong>Pellentesque habitant morbi tristique</strong> senectus et
          netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero
          sit amet quam egestas semper.
          <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo.
          Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat
          wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet,
          wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum
          rutrum orci, sagittis tempus lacus enim ac dui.
          <a
            href="#"
            class="link"
            >Donec non enim</a
          >
          in turpis pulvinar facilisis. Ut felis.
        </p>

        <p>
          Orci varius natoque penatibus et magnis dis
          <em>parturient montes</em>, nascetur ridiculus mus. Class aptent
          taciti sociosqu ad litora torquent per conubia nostra, per inceptos
          himenaeos. Curabitur vitae sagittis odio.
          <mark>Suspendisse</mark> ullamcorper nunc non pellentesque laoreet.
          Curabitur eu tortor id quam pretium mattis. Proin ut quam velit.
        </p>

        <h3>Header Level 3</h3>

        <img src="images/pages/help-center/image-1.jpg" />
        <p class="text-muted">
          <em
            >Nullam sagittis nulla in diam finibus, sed pharetra velit
            vestibulum. Suspendisse euismod in urna eu posuere.</em
          >
        </p>

        <h4>Header Level 4</h4>

        <blockquote>
          <p>
            Blockquote. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus magna. Cras in mi at felis aliquet congue. Ut a est eget
            ligula molestie gravida. Curabitur massa. Donec eleifend, libero at
            sagittis mollis, tellus est malesuada tellus, at luctus turpis elit
            sit amet quam. Vivamus pretium ornare est.
          </p>
          <footer>Brian Hughes</footer>
        </blockquote>

        <ol>
          <li>Ordered list</li>
          <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
          <li>Aliquam tincidunt mauris eu risus.</li>
        </ol>

        <h5>Header Level 5</h5>

        <ul>
          <li>Unordered list</li>
          <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
          <li>Aliquam tincidunt mauris eu risus.</li>
        </ul>

        <pre><code>#header h1 a &#123;
  display: block;
  width: 300px;
  height: 80px;
&#125;</code></pre>

        <h6>Header Level 6</h6>

        <dl>
          <dt>Definition list</dt>
          <dd>
            Quisque sit amet risus enim. Aliquam sit amet interdum justo, at
            ultricies sapien. Suspendisse et semper urna, in gravida eros.
            Quisque id nibh iaculis, euismod urna sed, egestas nisi. Donec eros
            metus, congue a imperdiet feugiat, sagittis nec ipsum. Quisque
            dapibus mollis felis non tristique.
          </dd>

          <dt>Definition list</dt>
          <dd>
            Ut auctor, metus sed dapibus tempus, urna diam auctor odio, in
            malesuada odio risus vitae nisi. Etiam blandit ante urna, vitae
            placerat massa mollis in. Duis nec urna ac purus semper dictum ut
            eget justo. Aenean non sagittis augue. Sed venenatis rhoncus enim
            eget ornare. Donec viverra sed felis at venenatis. Mauris aliquam
            fringilla nulla, sit amet congue felis dignissim at.
          </dd>
        </dl>
      </article>
    </div>
  `,
})
export default class HelpCenterGuide {}
