import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'help-center-faq',
  imports: [
    MatButton,
    RouterLink,
    MatIcon,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
  ],
  template: `
    <div
      class="@container mx-auto flex w-full max-w-4xl flex-auto flex-col items-start p-6 pt-2 lg:p-10 lg:pt-16"
    >
      <!-- Header -->
      <a
        matButton
        class="-ml-3"
        routerLink=".."
      >
        <mat-icon svgIcon="move-left" />
        Back to Help Center
      </a>

      <div class="relative mt-3 flex flex-col">
        <div class="text-xl font-bold tracking-tighter sm:text-4xl">
          Frequently Asked Questions
        </div>
      </div>

      <!-- Content -->
      <div class="mt-8 flex flex-col gap-y-8 sm:mt-12 sm:gap-y-12">
        @for (group of faqs; track group.id) {
          <div class="flex flex-col gap-y-4">
            <div
              class="leading-tight text-lg font-bold tracking-tight sm:text-3xl"
            >
              {{ group.title }}
            </div>
            <mat-accordion class="-mx-6">
              @for (faq of group.questions; track faq.id) {
                <mat-expansion-panel>
                  <mat-expansion-panel-header [collapsedHeight]="'56px'">
                    <mat-panel-title class="leading-tight font-medium">
                      {{ faq.question }}
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  {{ faq.answer }}
                </mat-expansion-panel>
              }
            </mat-accordion>
          </div>
        }
      </div>
    </div>
  `,
})
export default class HelpCenterFAQ {
  // Date
  protected faqs = [
    // Most asked
    {
      id: 'most-asked',
      title: 'Most asked',
      questions: [
        {
          id: '1',
          question: 'Is there a 14-days trial?',
          answer:
            'Magna consectetur culpa duis ad est tempor pariatur velit ullamco aute exercitation magna sunt commodo minim enim aliquip eiusmod ipsum adipisicing magna ipsum reprehenderit lorem magna voluptate magna aliqua culpa.\n\nSit nisi adipisicing pariatur enim enim sunt officia ad labore voluptate magna proident velit excepteur pariatur cillum sit excepteur elit veniam excepteur minim nisi cupidatat proident dolore irure veniam mollit.',
        },
        {
          id: '2',
          question: 'What’s the benefits of the Premium Membership?',
          answer:
            'Et in lorem qui ipsum deserunt duis exercitation lorem elit qui qui ipsum tempor nulla velit aliquip enim consequat incididunt pariatur duis excepteur elit irure nulla ipsum dolor dolore est.\n\nAute deserunt nostrud id non ipsum do adipisicing laboris in minim officia magna elit minim mollit elit velit veniam lorem pariatur veniam sit excepteur irure commodo excepteur duis quis in.',
        },
        {
          id: '3',
          question: 'How much time I will need to learn this app?',
          answer:
            'Id fugiat et cupidatat magna nulla nulla eu cillum officia nostrud dolore in veniam ullamco nulla ex duis est enim nisi aute ipsum velit et laboris est pariatur est culpa.\n\nCulpa sunt ipsum esse quis excepteur enim culpa est voluptate reprehenderit consequat duis officia irure voluptate veniam dolore fugiat dolor est amet nostrud non velit irure do voluptate id sit.',
        },
        {
          id: '4',
          question: 'Are there any free tutorials available?',
          answer:
            'Excepteur deserunt tempor do lorem elit id magna pariatur irure ullamco elit dolor consectetur ad officia fugiat incididunt do elit aute esse eu voluptate adipisicing incididunt ea dolor aliqua dolor.\n\nConsequat est quis deserunt voluptate ipsum incididunt laboris occaecat irure laborum voluptate non sit labore voluptate sunt id sint ut laboris aute cupidatat occaecat eiusmod non magna aliquip deserunt nisi.',
        },
        {
          id: '5',
          question: 'Is there a month-to-month payment option?',
          answer:
            'Labore mollit in aliqua exercitation aliquip elit nisi nisi voluptate reprehenderit et dolor incididunt cupidatat ullamco nulla consequat voluptate adipisicing dolor qui magna sint aute do excepteur in aliqua consectetur.\n\nElit laborum non duis irure ad ullamco aliqua enim exercitation quis fugiat aute esse esse magna et ad cupidatat voluptate sint nulla nulla lorem et enim deserunt proident deserunt consectetur.',
        },
      ],
    },

    // General inquiries
    {
      id: 'general-inquiries',
      title: 'General inquiries',
      questions: [
        {
          id: '1',
          question: 'How to download your items',
          answer:
            'Sunt mollit irure dolor aliquip sit veniam amet ut sunt dolore cillum sint pariatur qui irure proident velit non excepteur quis ut et quis velit aliqua ea sunt cillum sit.\n\nReprehenderit est culpa ut incididunt sit dolore mollit in occaecat velit culpa consequat reprehenderit ex lorem cupidatat proident reprehenderit ad eu sunt sit ut sit culpa ea reprehenderit aliquip est.',
        },
        {
          id: '2',
          question: 'View and download invoices',
          answer:
            'Sint mollit consectetur voluptate fugiat sunt ipsum adipisicing labore exercitation eiusmod enim excepteur enim proident velit sint magna commodo dolor ex ipsum sit nisi deserunt labore eu irure amet ea.\n\nOccaecat ut velit et sint pariatur laboris voluptate duis aliqua aliqua exercitation et duis duis eu laboris excepteur occaecat quis esse enim ex dolore commodo fugiat excepteur adipisicing in fugiat.',
        },
        {
          id: '3',
          question: "I've forgotten my username or password",
          answer:
            'In exercitation sunt ad anim commodo sunt do in sunt est officia amet ex ullamco do nisi consectetur lorem proident lorem adipisicing incididunt consequat fugiat voluptate sint est anim officia.\n\nVelit sint aliquip elit culpa amet eu mollit veniam esse deserunt ex occaecat quis lorem minim occaecat culpa esse veniam enim duis excepteur ipsum esse ut ut velit cillum adipisicing.',
        },
        {
          id: '4',
          question: 'Where is my license code?',
          answer:
            'Ad adipisicing duis consequat magna sunt consequat aliqua eiusmod qui et nostrud voluptate sit enim reprehenderit anim exercitation ipsum ipsum anim ipsum laboris aliqua ex lorem aute officia voluptate culpa.\n\nNostrud anim ex pariatur ipsum et nostrud esse veniam ipsum ipsum irure velit ad quis irure tempor nulla amet aute id esse reprehenderit ea consequat consequat ea minim magna magna.',
        },
        {
          id: '5',
          question: 'How to contact an author',
          answer:
            'Magna laborum et amet magna fugiat officia deserunt in exercitation aliquip nulla magna velit ea labore quis deserunt ipsum occaecat id id consequat non eiusmod mollit est voluptate ea ex.\n\nReprehenderit mollit ut excepteur minim veniam fugiat enim id pariatur amet elit nostrud occaecat pariatur et esse aliquip irure quis officia reprehenderit voluptate voluptate est et voluptate sint esse dolor.',
        },

        {
          id: '6',
          question: 'How does the affiliate program work?',
          answer:
            'Adipisicing laboris ipsum fugiat et cupidatat aute esse ad labore et est cillum ipsum sunt duis do veniam minim officia deserunt in eiusmod eu duis dolore excepteur consectetur id elit.\n\nAnim excepteur occaecat laborum sunt in elit quis sit duis adipisicing laboris anim laborum et pariatur elit qui consectetur laborum reprehenderit occaecat nostrud pariatur aliqua elit nisi commodo eu excepteur.',
        },
      ],
    },

    // Licenses
    {
      id: 'licenses',
      title: 'Licenses',
      questions: [
        {
          id: '1',
          question: 'How do licenses work for items I bought?',
          answer:
            'Culpa duis nostrud qui velit sint magna officia fugiat ipsum eiusmod enim laborum pariatur anim culpa elit ipsum lorem pariatur exercitation laborum do labore cillum exercitation nisi reprehenderit exercitation quis.\n\nMollit aute dolor non elit et incididunt eiusmod non in commodo occaecat id in excepteur aliqua ea anim pariatur sint elit voluptate dolor eu non laborum laboris voluptate qui duis.',
        },
        {
          id: '2',
          question: 'Do licenses have an expiry date?',
          answer:
            'Ea proident dolor tempor dolore incididunt velit incididunt ullamco quis proident consectetur magna excepteur cillum officia ex do aliqua reprehenderit est esse officia labore dolore aute laboris eu commodo aute.\n\nOfficia quis id ipsum adipisicing ipsum eu exercitation cillum ex elit pariatur adipisicing ullamco ullamco nulla dolore magna aliqua reprehenderit eu laborum voluptate reprehenderit non eiusmod deserunt velit magna do.',
        },
        {
          id: '3',
          question: 'I want to make multiple end products with the same item',
          answer:
            'Elit cillum incididunt enim cupidatat ex elit cillum aute dolor consectetur proident non minim eu est deserunt proident mollit ullamco laborum anim ea labore anim ex enim ullamco consectetur enim.\n\nEx magna consectetur esse enim consequat non aliqua nulla labore mollit sit quis ex fugiat commodo eu cupidatat irure incididunt consequat enim ut deserunt consequat elit consequat sint adipisicing sunt.',
        },
        {
          id: '4',
          question: 'How easy is it to change the license type?',
          answer:
            'Duis culpa ut veniam voluptate consequat proident magna eiusmod id est magna culpa nulla enim culpa mollit velit lorem mollit ut minim dolore in tempor reprehenderit cillum occaecat proident ea.\n\nVeniam fugiat ea duis qui et eu eiusmod voluptate id cillum eiusmod eu reprehenderit minim reprehenderit nisi cillum nostrud duis eu magna minim sunt voluptate eu pariatur nulla ullamco elit.',
        },
        {
          id: '5',
          question: 'Do I need a Regular License or an Extended License?',
          answer:
            'Mollit nostrud ea irure ex ipsum in cupidatat irure sit officia reprehenderit adipisicing et occaecat cupidatat exercitation mollit esse in excepteur qui elit exercitation velit fugiat exercitation est officia excepteur.\n\nQuis esse voluptate laborum non veniam duis est fugiat tempor culpa minim velit minim ut duis qui officia consectetur ex nostrud ut elit elit nulla in consectetur voluptate aliqua aliqua.',
        },
      ],
    },

    // Payments
    {
      id: 'payments',
      title: 'Payments',
      questions: [
        {
          id: '1',
          question: 'Common PayPal, Skrill, and credit card issues',
          answer:
            'Sit occaecat sint nulla in esse dolor occaecat in ea sit irure magna magna veniam fugiat consequat exercitation ipsum ex officia velit consectetur consequat voluptate lorem eu proident lorem incididunt.\n\nExcepteur exercitation et qui labore nisi eu voluptate ipsum deserunt deserunt eu est minim dolor ad proident nulla reprehenderit culpa minim voluptate dolor nostrud dolor anim labore aliqua officia nostrud.',
        },
        {
          id: '2',
          question: 'How do I find my transaction ID?',
          answer:
            'Laboris ea nisi commodo nulla cillum consequat consectetur nisi velit adipisicing minim nulla culpa amet quis sit duis id id aliqua aute exercitation non reprehenderit aliquip enim eiusmod eu irure.\n\nNon irure consectetur sunt cillum do adipisicing excepteur labore proident ut officia dolor fugiat velit sint consectetur cillum qui amet enim anim mollit laboris consectetur non do laboris lorem aliqua.',
        },
        {
          id: '3',
          question: 'PayPal disputes And chargebacks',
          answer:
            'Ullamco eiusmod do pariatur pariatur consectetur commodo proident ex voluptate ullamco culpa commodo deserunt pariatur incididunt nisi magna dolor est minim eu ex voluptate deserunt labore id magna excepteur et.\n\nReprehenderit dolore pariatur exercitation ad non fugiat quis proident fugiat incididunt ea magna pariatur et exercitation tempor cillum eu consequat adipisicing est laborum sit cillum ea fugiat mollit cupidatat est.',
        },
        {
          id: '4',
          question: 'Saving your credit card details',
          answer:
            'Qui quis nulla excepteur voluptate elit culpa occaecat id ex do adipisicing est mollit id anim nisi irure amet officia ut sint aliquip dolore labore cupidatat magna laborum esse ea.\n\nEnim magna duis sit incididunt amet anim et nostrud laborum eiusmod et ea fugiat aliquip velit sit fugiat consectetur ipsum anim do enim excepteur cupidatat consequat sunt irure tempor ut.',
        },
        {
          id: '5',
          question: 'Why do prepaid credits expire?',
          answer:
            'Consequat consectetur commodo deserunt sunt aliquip deserunt ex tempor esse nostrud sit dolore anim nostrud nulla dolore veniam minim laboris non dolor veniam lorem veniam deserunt laborum aute amet irure.\n\nEiusmod officia veniam reprehenderit ea aliquip velit anim aute minim aute nisi tempor qui sunt deserunt voluptate velit elit ut adipisicing ipsum et excepteur ipsum eu ullamco nisi esse dolor.',
        },
        {
          id: '6',
          question: 'Why is there a minimum $20 credit?',
          answer:
            'Duis sint velit incididunt exercitation eiusmod nisi sunt ex est fugiat ad cupidatat sunt nisi elit do duis amet voluptate ipsum aliquip lorem aliqua sint esse in magna irure officia.\n\nNon eu ex elit ut est voluptate tempor amet ut officia in duis deserunt cillum labore do culpa id dolore magna anim consectetur qui consectetur fugiat labore mollit magna irure.',
        },
      ],
    },

    // Support
    {
      id: 'support',
      title: 'Support',
      questions: [
        {
          id: '1',
          question: 'What is item support?',
          answer:
            'Exercitation sit eiusmod enim officia exercitation eiusmod sunt eiusmod excepteur ad commodo eiusmod qui proident quis aliquip excepteur sit cillum occaecat non dolore sit in labore ut duis esse duis.\n\nConsequat sunt voluptate consectetur dolor laborum enim nostrud deserunt incididunt sint veniam laboris sunt amet velit anim duis aliqua sunt aliqua aute qui nisi mollit qui irure ullamco aliquip laborum.',
        },
        {
          id: '2',
          question: 'How to contact an author',
          answer:
            'Minim commodo cillum do id qui irure aliqua laboris excepteur laboris magna enim est lorem consectetur tempor laboris proident proident eu irure dolor eiusmod in officia lorem quis laborum ullamco.\n\nQui excepteur ex sit esse dolore deserunt ullamco occaecat laboris fugiat cupidatat excepteur laboris amet dolore enim velit ipsum velit sint cupidatat consectetur cupidatat deserunt sit eu do ullamco quis.',
        },
        {
          id: '3',
          question: 'Extending and renewing item support',
          answer:
            'Reprehenderit anim consectetur anim dolor magna consequat excepteur tempor enim duis magna proident ullamco aute voluptate elit laborum mollit labore id ex lorem est mollit do qui ex labore nulla.\n\nUt proident elit proident adipisicing elit fugiat ex ullamco dolore excepteur excepteur labore laborum sunt ipsum proident magna ex voluptate laborum voluptate sint proident eu reprehenderit non excepteur quis eiusmod.',
        },
        {
          id: '4',
          question: 'Rating or review removal policy',
          answer:
            'Ipsum officia mollit qui laboris sunt amet aliquip cupidatat minim non elit commodo eiusmod labore mollit pariatur aute reprehenderit ullamco occaecat enim pariatur aute amet occaecat incididunt irure ad ut.\n\nIncididunt cupidatat pariatur magna sint sit culpa ad cupidatat cillum exercitation consequat minim pariatur consectetur aliqua non adipisicing magna ad nulla ea do est nostrud eu aute id occaecat ut.',
        },
        {
          id: '5',
          question: 'Purchasing supported and unsupported items',
          answer:
            'Dolor cupidatat do qui in tempor dolor magna magna ut dolor est aute veniam consectetur enim sunt sunt duis magna magna aliquip id reprehenderit dolor in veniam ullamco incididunt occaecat.\n\nId duis pariatur anim cillum est sint non veniam voluptate deserunt anim nostrud duis voluptate occaecat elit ut veniam voluptate do qui est ad velit irure sint lorem ullamco aliqua.',
        },
        {
          id: '6',
          question: "I haven't received a response from the author",
          answer:
            'Velit commodo pariatur ullamco elit sunt dolor quis irure amet tempor laboris labore tempor nisi consectetur ea proident dolore culpa nostrud esse amet commodo do esse laboris laboris in magna.\n\nAute officia labore minim laborum irure cupidatat occaecat laborum ex labore ipsum aliqua cillum do exercitation esse et veniam excepteur mollit incididunt ut qui irure culpa qui deserunt nostrud tempor.',
        },
        {
          id: '7',
          question: 'Responding to requests outside of support',
          answer:
            'Exercitation eu in officia lorem commodo pariatur pariatur nisi consectetur qui elit in aliquip et ullamco duis nostrud aute laborum laborum est dolor non qui amet deserunt ex et aliquip.\n\nProident consectetur eu amet minim labore anim ad non aute duis eiusmod sit ad elit magna do aliquip aliqua laborum dolor laboris ea irure duis mollit fugiat tempor eu est.',
        },
      ],
    },
  ];
}
