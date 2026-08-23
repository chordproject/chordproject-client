import { Component } from '@angular/core';

@Component({
  selector: 'example',
  template: `
    <div class="flex flex-auto flex-col px-6 py-4 lg:px-8 lg:py-8">
      <div class="text-xl font-semibold tracking-tighter sm:text-2xl">
        Example
      </div>
      <div class="mt-4 text-neutral-500">
        This is a blank starting point for your application. Create your own
        modules under
        <code class="font-mono">src/app/domains/admin/modules</code> and
        register them in the admin routes and navigation data.
      </div>
    </div>
  `,
})
export default class Example {}
