import { Injectable } from '@angular/core';
import { Tag, Task } from '@/app/domains/admin/modules/apps/tasks/data/model';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private tags: Tag[] = [
    {
      id: 'a0bf42ca-c3a5-47be-8341-b9c0bb8ef270',
      title: 'Api',
    },
    {
      id: 'c6058d0d-a4b0-4453-986a-9d249ec230b1',
      title: 'Frontend',
    },
    {
      id: 'd3ef4226-ef2c-43b0-a986-3e3e07f32799',
      title: 'Bug',
    },
    {
      id: '51483dd3-cb98-4400-9128-4bd66b455807',
      title: 'Backend',
    },
    {
      id: '91658b8a-f382-4b0c-a53f-e9390351c2c5',
      title: 'Urgent',
    },
    {
      id: '2b884143-419a-45ca-a7f6-48f99f4e7798',
      title: 'Discuss',
    },
  ];
  private members = [
    {
      id: '65f1c421-83c5-4cdf-99da-d97794328679',
      name: 'Angeline Vinson',
      avatar: 'images/avatars/female-01.jpg',
    },
    {
      id: '88a2a76c-0e6f-49da-b617-46d7c3b6e64d',
      name: 'Roseann Greer',
      avatar: 'images/avatars/female-02.jpg',
    },
    {
      id: '6ab7751e-6579-40af-9171-231c0fd6a993',
      name: 'Lorraine Barnett',
      avatar: 'images/avatars/female-03.jpg',
    },
    {
      id: '3e353312-6a9b-46af-adda-5061b06e806b',
      name: 'Middleton Bradford',
      avatar: 'images/avatars/male-01.jpg',
    },
    {
      id: '3a23baf7-2db8-4ef5-8d49-86d3e708dff5',
      name: 'Sue Hays',
      avatar: 'images/avatars/female-04.jpg',
    },
    {
      id: 'e62ab50e-90d3-4ed7-a911-093bb44d0c50',
      name: 'Keith Neal',
      avatar: 'images/avatars/male-02.jpg',
    },
    {
      id: '368aab1e-ebce-43ba-8925-4cf13937867b',
      name: 'Wilkins Gilmore',
      avatar: 'images/avatars/male-03.jpg',
    },
    {
      id: 'ef44b39b-3272-45f5-a15e-264c3b2d118e',
      name: 'Baldwin Stein',
      avatar: 'images/avatars/male-04.jpg',
    },
    {
      id: '7f5db993-ec36-412f-9db3-16d076a98807',
      name: 'Bobbie Cohen',
      avatar: 'images/avatars/female-05.jpg',
    },
    {
      id: 'e2c81627-a8a1-4bbc-9adc-ac4281e040d4',
      name: 'Melody Peters',
      avatar: 'images/avatars/female-06.jpg',
    },
    {
      id: 'a21ec32e-54ba-480b-afdc-d1cbe18a96fd',
      name: 'Marquez Ryan',
      avatar: 'images/avatars/male-05.jpg',
    },
    {
      id: '45e09584-1a54-40e6-8210-1de4d1c05593',
      name: 'Roberta Briggs',
      avatar: 'images/avatars/female-07.jpg',
    },
    {
      id: '6617b0a3-0ccd-44ea-af78-c6633115d683',
      name: 'Robbie Buckley',
      avatar: 'images/avatars/female-08.jpg',
    },
    {
      id: '271e6a06-0d37-433d-bc8d-607b12bcbed9',
      name: 'Garcia Whitney',
      avatar: 'images/avatars/male-06.jpg',
    },
    {
      id: '65e15136-5168-4655-8bbc-e3ad8a94bf67',
      name: 'Spencer Pate',
      avatar: 'images/avatars/male-07.jpg',
    },
    {
      id: '28dcda24-812d-4086-9638-b28bd85beecc',
      name: 'Monica Mcdaniel',
      avatar: 'images/avatars/female-09.jpg',
    },
    {
      id: '56a3e7ce-01da-43fc-ab9f-a8a39fa980de',
      name: 'Mcmillan Durham',
      avatar: 'images/avatars/male-08.jpg',
    },
    {
      id: '4d24cf48-a322-4d53-89cb-9140dfd5c6ba',
      name: 'Jfuseine Hebert',
      avatar: 'images/avatars/female-10.jpg',
    },
    {
      id: 'b2e97a96-2f15-4e3d-aff5-4ddf2af924d4',
      name: 'Susanna Kline',
      avatar: 'images/avatars/female-11.jpg',
    },
    {
      id: '4678ad07-e057-48a9-a5d1-3cf98e722eeb',
      name: 'Suzette Singleton',
      avatar: 'images/avatars/female-12.jpg',
    },
  ];
  private tasks: Task[] = [
    {
      id: 'f65d517a-6f69-4c88-81f5-416f47405ce1',
      type: 'section',
      title: 'Company internal application v2.0.0',
      notes:
        'Magna consectetur culpa duis ad est tempor pariatur velit ullamco aute exercitation magna sunt commodo minim enim aliquip eiusmod ipsum adipisicing magna ipsum reprehenderit lorem magna voluptate magna aliqua culpa.\n\nSit nisi adipisicing pariatur enim enim sunt officia ad labore voluptate magna proident velit excepteur pariatur cillum sit excepteur elit veniam excepteur minim nisi cupidatat proident dolore irure veniam mollit.',
      completed: false,
      dueDate: '2017-10-18T13:03:37.943Z',
      priority: 1,
      tags: [
        '91658b8a-f382-4b0c-a53f-e9390351c2c5',
        '51483dd3-cb98-4400-9128-4bd66b455807',
      ],
      assignees: [],
      order: 0,
    },
    {
      id: '0fcece82-1691-4b98-a9b9-b63218f9deef',
      type: 'task',
      title:
        'Create the landing/marketing page and host it on the beta channel',
      notes:
        'Et in lorem qui ipsum deserunt duis exercitation lorem elit qui qui ipsum tempor nulla velit aliquip enim consequat incididunt pariatur duis excepteur elit irure nulla ipsum dolor dolore est.\n\nAute deserunt nostrud id non ipsum do adipisicing laboris in minim officia magna elit minim mollit elit velit veniam lorem pariatur veniam sit excepteur irure commodo excepteur duis quis in.',
      completed: false,
      dueDate: null,
      priority: 0,
      tags: [],
      assignees: ['e2c81627-a8a1-4bbc-9adc-ac4281e040d4'],
      order: 1,
    },
    {
      id: '2e6971cd-49d5-49f1-8cbd-fba5c71e6062',
      type: 'task',
      title: 'Move dependency system for easier package management',
      notes:
        'Id fugiat et cupidatat magna nulla nulla eu cillum officia nostrud dolore in veniam ullamco nulla ex duis est enim nisi aute ipsum velit et laboris est pariatur est culpa.\n\nCulpa sunt ipsum esse quis excepteur enim culpa est voluptate reprehenderit consequat duis officia irure voluptate veniam dolore fugiat dolor est amet nostrud non velit irure do voluptate id sit.',
      completed: false,
      dueDate: '2019-05-24T03:55:38.969Z',
      priority: 0,
      tags: [
        'c6058d0d-a4b0-4453-986a-9d249ec230b1',
        '2b884143-419a-45ca-a7f6-48f99f4e7798',
        '91658b8a-f382-4b0c-a53f-e9390351c2c5',
      ],
      assignees: ['88a2a76c-0e6f-49da-b617-46d7c3b6e64d'],
      order: 2,
    },
    {
      id: '974f93b8-336f-4eec-b011-9ddb412ee828',
      type: 'task',
      title: 'Fix permission issues that the 0.0.7-alpha.2 has introduced',
      notes:
        'Excepteur deserunt tempor do lorem elit id magna pariatur irure ullamco elit dolor consectetur ad officia fugiat incididunt do elit aute esse eu voluptate adipisicing incididunt ea dolor aliqua dolor.\n\nConsequat est quis deserunt voluptate ipsum incididunt laboris occaecat irure laborum voluptate non sit labore voluptate sunt id sint ut laboris aute cupidatat occaecat eiusmod non magna aliquip deserunt nisi.',
      completed: true,
      dueDate: null,
      priority: 2,
      tags: ['a0bf42ca-c3a5-47be-8341-b9c0bb8ef270'],
      assignees: [],
      order: 3,
    },
    {
      id: '5d877fc7-b881-4527-a6aa-d39d642feb23',
      type: 'task',
      title: 'Start promotions using the company account',
      notes:
        'Labore mollit in aliqua exercitation aliquip elit nisi nisi voluptate reprehenderit et dolor incididunt cupidatat ullamco nulla consequat voluptate adipisicing dolor qui magna sint aute do excepteur in aliqua consectetur.\n\nElit laborum non duis irure ad ullamco aliqua enim exercitation quis fugiat aute esse esse magna et ad cupidatat voluptate sint nulla nulla lorem et enim deserunt proident deserunt consectetur.',
      completed: true,
      dueDate: null,
      priority: 1,
      tags: ['51483dd3-cb98-4400-9128-4bd66b455807'],
      assignees: ['4678ad07-e057-48a9-a5d1-3cf98e722eeb'],
      order: 4,
    },
    {
      id: '3d1c26c5-1e5e-4eb6-8006-ed6037ed9aca',
      type: 'task',
      title: 'Add more error pages - 401, 301, 303, 500 etc.',
      notes:
        'Sunt mollit irure dolor aliquip sit veniam amet ut sunt dolore cillum sint pariatur qui irure proident velit non excepteur quis ut et quis velit aliqua ea sunt cillum sit.\n\nReprehenderit est culpa ut incididunt sit dolore mollit in occaecat velit culpa consequat reprehenderit ex lorem cupidatat proident reprehenderit ad eu sunt sit ut sit culpa ea reprehenderit aliquip est.',
      completed: false,
      dueDate: '2018-09-29T19:30:45.325Z',
      priority: 1,
      tags: ['c6058d0d-a4b0-4453-986a-9d249ec230b1'],
      assignees: ['6617b0a3-0ccd-44ea-af78-c6633115d683'],
      order: 5,
    },
    {
      id: '11bd2b9a-85b4-41c9-832c-bd600dfa3a52',
      type: 'task',
      title: 'Clear the caches before the production build',
      notes:
        'Sint mollit consectetur voluptate fugiat sunt ipsum adipisicing labore exercitation eiusmod enim excepteur enim proident velit sint magna commodo dolor ex ipsum sit nisi deserunt labore eu irure amet ea.\n\nOccaecat ut velit et sint pariatur laboris voluptate duis aliqua aliqua exercitation et duis duis eu laboris excepteur occaecat quis esse enim ex dolore commodo fugiat excepteur adipisicing in fugiat.',
      completed: true,
      dueDate: '2017-10-12T12:03:55.559Z',
      priority: 2,
      tags: [],
      assignees: ['271e6a06-0d37-433d-bc8d-607b12bcbed9'],
      order: 6,
    },
    {
      id: 'f55c023a-785e-4f0f-b5b7-47da75224deb',
      type: 'task',
      title:
        'Examine the package loss rates that the 0.0.7-alpha.1 has introduced',
      notes:
        'In exercitation sunt ad anim commodo sunt do in sunt est officia amet ex ullamco do nisi consectetur lorem proident lorem adipisicing incididunt consequat fugiat voluptate sint est anim officia.\n\nVelit sint aliquip elit culpa amet eu mollit veniam esse deserunt ex occaecat quis lorem minim occaecat culpa esse veniam enim duis excepteur ipsum esse ut ut velit cillum adipisicing.',
      completed: false,
      dueDate: '2022-06-05T19:41:12.501Z',
      priority: 2,
      tags: [],
      assignees: ['7f5db993-ec36-412f-9db3-16d076a98807'],
      order: 7,
    },
    {
      id: 'c577a67d-357a-4b88-96e8-a0ee1fe9162e',
      type: 'task',
      title: 'Start ads using the company coupons',
      notes:
        'Ad adipisicing duis consequat magna sunt consequat aliqua eiusmod qui et nostrud voluptate sit enim reprehenderit anim exercitation ipsum ipsum anim ipsum laboris aliqua ex lorem aute officia voluptate culpa.\n\nNostrud anim ex pariatur ipsum et nostrud esse veniam ipsum ipsum irure velit ad quis irure tempor nulla amet aute id esse reprehenderit ea consequat consequat ea minim magna magna.',
      completed: false,
      dueDate: '2020-04-06T02:57:58.506Z',
      priority: 1,
      tags: [
        'c6058d0d-a4b0-4453-986a-9d249ec230b1',
        'a0bf42ca-c3a5-47be-8341-b9c0bb8ef270',
      ],
      assignees: ['a21ec32e-54ba-480b-afdc-d1cbe18a96fd'],
      order: 8,
    },
    {
      id: '1a680c29-7ece-4a80-9709-277ad4da8b4b',
      type: 'section',
      title: 'Developer API for the payment system',
      notes:
        'Magna laborum et amet magna fugiat officia deserunt in exercitation aliquip nulla magna velit ea labore quis deserunt ipsum occaecat id id consequat non eiusmod mollit est voluptate ea ex.\n\nReprehenderit mollit ut excepteur minim veniam fugiat enim id pariatur amet elit nostrud occaecat pariatur et esse aliquip irure quis officia reprehenderit voluptate voluptate est et voluptate sint esse dolor.',
      completed: false,
      dueDate: '2020-02-08T22:42:35.937Z',
      priority: 2,
      tags: [
        'a0bf42ca-c3a5-47be-8341-b9c0bb8ef270',
        '2b884143-419a-45ca-a7f6-48f99f4e7798',
      ],
      assignees: ['3e353312-6a9b-46af-adda-5061b06e806b'],
      order: 9,
    },
    {
      id: 'c49c2216-8bdb-4df0-be25-d5ea1dbb5688',
      type: 'task',
      title: 'Re-think the current API restrictions to loosen them a bit',
      notes:
        'Adipisicing laboris ipsum fugiat et cupidatat aute esse ad labore et est cillum ipsum sunt duis do veniam minim officia deserunt in eiusmod eu duis dolore excepteur consectetur id elit.\n\nAnim excepteur occaecat laborum sunt in elit quis sit duis adipisicing laboris anim laborum et pariatur elit qui consectetur laborum reprehenderit occaecat nostrud pariatur aliqua elit nisi commodo eu excepteur.',
      completed: false,
      dueDate: '2019-08-10T06:18:17.785Z',
      priority: 1,
      tags: ['a0bf42ca-c3a5-47be-8341-b9c0bb8ef270'],
      assignees: ['368aab1e-ebce-43ba-8925-4cf13937867b'],
      order: 10,
    },
    {
      id: '3ef176fa-6cba-4536-9f43-540c686a4faa',
      type: 'task',
      title: 'Pre-flight checks causes random crashes on logging service',
      notes:
        'Culpa duis nostrud qui velit sint magna officia fugiat ipsum eiusmod enim laborum pariatur anim culpa elit ipsum lorem pariatur exercitation laborum do labore cillum exercitation nisi reprehenderit exercitation quis.\n\nMollit aute dolor non elit et incididunt eiusmod non in commodo occaecat id in excepteur aliqua ea anim pariatur sint elit voluptate dolor eu non laborum laboris voluptate qui duis.',
      completed: false,
      dueDate: '2024-08-23T14:33:06.227Z',
      priority: 2,
      tags: ['91658b8a-f382-4b0c-a53f-e9390351c2c5'],
      assignees: ['271e6a06-0d37-433d-bc8d-607b12bcbed9'],
      order: 11,
    },
    {
      id: '7bc6b7b4-7ad8-4cbe-af36-7301642d35fb',
      type: 'task',
      title: 'Increase the timeout amount to allow more retries on client side',
      notes:
        'Ea proident dolor tempor dolore incididunt velit incididunt ullamco quis proident consectetur magna excepteur cillum officia ex do aliqua reprehenderit est esse officia labore dolore aute laboris eu commodo aute.\n\nOfficia quis id ipsum adipisicing ipsum eu exercitation cillum ex elit pariatur adipisicing ullamco ullamco nulla dolore magna aliqua reprehenderit eu laborum voluptate reprehenderit non eiusmod deserunt velit magna do.',
      completed: true,
      dueDate: '2017-08-16T12:56:48.039Z',
      priority: 1,
      tags: [
        '51483dd3-cb98-4400-9128-4bd66b455807',
        'd3ef4226-ef2c-43b0-a986-3e3e07f32799',
        'a0bf42ca-c3a5-47be-8341-b9c0bb8ef270',
      ],
      assignees: ['4d24cf48-a322-4d53-89cb-9140dfd5c6ba'],
      order: 12,
    },
    {
      id: '56c9ed66-a1d2-4803-a160-fba29b826cb4',
      type: 'task',
      title:
        'Create the landing/marketing page and host it on the beta channel',
      notes:
        'Elit cillum incididunt enim cupidatat ex elit cillum aute dolor consectetur proident non minim eu est deserunt proident mollit ullamco laborum anim ea labore anim ex enim ullamco consectetur enim.\n\nEx magna consectetur esse enim consequat non aliqua nulla labore mollit sit quis ex fugiat commodo eu cupidatat irure incididunt consequat enim ut deserunt consequat elit consequat sint adipisicing sunt.',
      completed: true,
      dueDate: '2023-09-15T15:12:36.910Z',
      priority: 0,
      tags: ['2b884143-419a-45ca-a7f6-48f99f4e7798'],
      assignees: ['3a23baf7-2db8-4ef5-8d49-86d3e708dff5'],
      order: 13,
    },
    {
      id: '21c1b662-33c8-44d7-9530-91896afeeac7',
      type: 'task',
      title: 'Move dependency system for easier package management',
      notes:
        'Duis culpa ut veniam voluptate consequat proident magna eiusmod id est magna culpa nulla enim culpa mollit velit lorem mollit ut minim dolore in tempor reprehenderit cillum occaecat proident ea.\n\nVeniam fugiat ea duis qui et eu eiusmod voluptate id cillum eiusmod eu reprehenderit minim reprehenderit nisi cillum nostrud duis eu magna minim sunt voluptate eu pariatur nulla ullamco elit.',
      completed: true,
      dueDate: '2020-08-08T16:32:24.768Z',
      priority: 1,
      tags: [],
      assignees: [],
      order: 14,
    },
    {
      id: '5fa52c90-82be-41ae-96ec-5fc67cf054a4',
      type: 'task',
      title: 'Fix permission issues that the 0.0.7-alpha.2 has introduced',
      notes:
        'Mollit nostrud ea irure ex ipsum in cupidatat irure sit officia reprehenderit adipisicing et occaecat cupidatat exercitation mollit esse in excepteur qui elit exercitation velit fugiat exercitation est officia excepteur.\n\nQuis esse voluptate laborum non veniam duis est fugiat tempor culpa minim velit minim ut duis qui officia consectetur ex nostrud ut elit elit nulla in consectetur voluptate aliqua aliqua.',
      completed: false,
      dueDate: '2019-10-13T08:25:17.064Z',
      priority: 0,
      tags: ['2b884143-419a-45ca-a7f6-48f99f4e7798'],
      assignees: ['b2e97a96-2f15-4e3d-aff5-4ddf2af924d4'],
      order: 15,
    },
    {
      id: 'b6d8909f-f36d-4885-8848-46b8230d4476',
      type: 'task',
      title: 'Start promotions using the company account',
      notes:
        'Laboris ea nisi commodo nulla cillum consequat consectetur nisi velit adipisicing minim nulla culpa amet quis sit duis id id aliqua aute exercitation non reprehenderit aliquip enim eiusmod eu irure.\n\nNon irure consectetur sunt cillum do adipisicing excepteur labore proident ut officia dolor fugiat velit sint consectetur cillum qui amet enim anim mollit laboris consectetur non do laboris lorem aliqua.',
      completed: true,
      dueDate: '2020-02-03T05:39:30.880Z',
      priority: 1,
      tags: ['2b884143-419a-45ca-a7f6-48f99f4e7798'],
      assignees: ['65e15136-5168-4655-8bbc-e3ad8a94bf67'],
      order: 16,
    },
    {
      id: '9496235d-4d0c-430b-817e-1cba96404f95',
      type: 'task',
      title: 'Add more error pages - 401, 301, 303, 500 etc.',
      notes:
        'Ullamco eiusmod do pariatur pariatur consectetur commodo proident ex voluptate ullamco culpa commodo deserunt pariatur incididunt nisi magna dolor est minim eu ex voluptate deserunt labore id magna excepteur et.\n\nReprehenderit dolore pariatur exercitation ad non fugiat quis proident fugiat incididunt ea magna pariatur et exercitation tempor cillum eu consequat adipisicing est laborum sit cillum ea fugiat mollit cupidatat est.',
      completed: true,
      dueDate: '2020-03-09T19:42:06.383Z',
      priority: 1,
      tags: [],
      assignees: ['7f5db993-ec36-412f-9db3-16d076a98807'],
      order: 17,
    },
    {
      id: '7fde17e6-4ac1-47dd-a363-2f4f14dcf76a',
      type: 'task',
      title: 'Clear the caches before the production build',
      notes:
        'Qui quis nulla excepteur voluptate elit culpa occaecat id ex do adipisicing est mollit id anim nisi irure amet officia ut sint aliquip dolore labore cupidatat magna laborum esse ea.\n\nEnim magna duis sit incididunt amet anim et nostrud laborum eiusmod et ea fugiat aliquip velit sit fugiat consectetur ipsum anim do enim excepteur cupidatat consequat sunt irure tempor ut.',
      completed: true,
      dueDate: '2022-08-24T03:03:09.899Z',
      priority: 1,
      tags: [
        '2b884143-419a-45ca-a7f6-48f99f4e7798',
        '91658b8a-f382-4b0c-a53f-e9390351c2c5',
        'c6058d0d-a4b0-4453-986a-9d249ec230b1',
        'a0bf42ca-c3a5-47be-8341-b9c0bb8ef270',
      ],
      assignees: ['88a2a76c-0e6f-49da-b617-46d7c3b6e64d'],
      order: 18,
    },
    {
      id: '90a3ed58-e13b-40cf-9219-f933bf9c9b8f',
      type: 'task',
      title:
        'Examine the package loss rates that the 0.0.7-alpha.1 has introduced',
      notes:
        'Consequat consectetur commodo deserunt sunt aliquip deserunt ex tempor esse nostrud sit dolore anim nostrud nulla dolore veniam minim laboris non dolor veniam lorem veniam deserunt laborum aute amet irure.\n\nEiusmod officia veniam reprehenderit ea aliquip velit anim aute minim aute nisi tempor qui sunt deserunt voluptate velit elit ut adipisicing ipsum et excepteur ipsum eu ullamco nisi esse dolor.',
      completed: false,
      dueDate: '2023-10-04T15:48:16.507Z',
      priority: 1,
      tags: ['d3ef4226-ef2c-43b0-a986-3e3e07f32799'],
      assignees: [],
      order: 19,
    },
    {
      id: '81ac908c-35a2-4705-8d75-539863c35c09',
      type: 'task',
      title: 'Start ads using the company coupons',
      notes:
        'Sit occaecat sint nulla in esse dolor occaecat in ea sit irure magna magna veniam fugiat consequat exercitation ipsum ex officia velit consectetur consequat voluptate lorem eu proident lorem incididunt.\n\nExcepteur exercitation et qui labore nisi eu voluptate ipsum deserunt deserunt eu est minim dolor ad proident nulla reprehenderit culpa minim voluptate dolor nostrud dolor anim labore aliqua officia nostrud.',
      completed: true,
      dueDate: '2024-02-01T10:02:52.745Z',
      priority: 1,
      tags: ['a0bf42ca-c3a5-47be-8341-b9c0bb8ef270'],
      assignees: ['368aab1e-ebce-43ba-8925-4cf13937867b'],
      order: 20,
    },
    {
      id: '153376ed-691f-4dfd-ae99-e204a49edc44',
      type: 'task',
      title: 'Re-think the current API restrictions to loosen them a bit',
      notes:
        'Duis sint velit incididunt exercitation eiusmod nisi sunt ex est fugiat ad cupidatat sunt nisi elit do duis amet voluptate ipsum aliquip lorem aliqua sint esse in magna irure officia.\n\nNon eu ex elit ut est voluptate tempor amet ut officia in duis deserunt cillum labore do culpa id dolore magna anim consectetur qui consectetur fugiat labore mollit magna irure.',
      completed: true,
      dueDate: '2021-02-22T17:42:00.257Z',
      priority: 2,
      tags: [],
      assignees: ['65f1c421-83c5-4cdf-99da-d97794328679'],
      order: 21,
    },
    {
      id: '1ebde495-1bcd-4e8f-b6f6-cf63b521ad06',
      type: 'section',
      title: 'Marketing and promotions for the mobile app',
      notes:
        'Aute commodo reprehenderit cupidatat duis nulla mollit sint cupidatat elit adipisicing fugiat sunt cupidatat amet proident fugiat aute adipisicing et non minim occaecat ea esse consectetur aute culpa exercitation incididunt.\n\nEnim et lorem anim dolor excepteur qui tempor cupidatat do proident adipisicing esse incididunt mollit quis irure amet ad officia culpa minim cillum veniam voluptate lorem exercitation sunt cillum dolor.',
      completed: false,
      dueDate: '2018-08-04T19:32:53.652Z',
      priority: 1,
      tags: [],
      assignees: ['e62ab50e-90d3-4ed7-a911-093bb44d0c50'],
      order: 22,
    },
    {
      id: '4e7ce72f-863a-451f-9160-cbd4fbbc4c3d',
      type: 'task',
      title: 'Pre-flight checks causes random crashes on logging service',
      notes:
        'Exercitation sit eiusmod enim officia exercitation eiusmod sunt eiusmod excepteur ad commodo eiusmod qui proident quis aliquip excepteur sit cillum occaecat non dolore sit in labore ut duis esse duis.\n\nConsequat sunt voluptate consectetur dolor laborum enim nostrud deserunt incididunt sint veniam laboris sunt amet velit anim duis aliqua sunt aliqua aute qui nisi mollit qui irure ullamco aliquip laborum.',
      completed: true,
      dueDate: '2020-09-29T02:25:14.111Z',
      priority: 1,
      tags: [],
      assignees: ['ef44b39b-3272-45f5-a15e-264c3b2d118e'],
      order: 23,
    },
    {
      id: '0795a74f-7a84-4edf-8d66-296cdef70003',
      type: 'task',
      title: 'Increase the timeout amount to allow more retries on client side',
      notes:
        'Minim commodo cillum do id qui irure aliqua laboris excepteur laboris magna enim est lorem consectetur tempor laboris proident proident eu irure dolor eiusmod in officia lorem quis laborum ullamco.\n\nQui excepteur ex sit esse dolore deserunt ullamco occaecat laboris fugiat cupidatat excepteur laboris amet dolore enim velit ipsum velit sint cupidatat consectetur cupidatat deserunt sit eu do ullamco quis.',
      completed: true,
      dueDate: '2019-03-09T02:34:29.592Z',
      priority: 2,
      tags: [
        'c6058d0d-a4b0-4453-986a-9d249ec230b1',
        'd3ef4226-ef2c-43b0-a986-3e3e07f32799',
      ],
      assignees: ['6617b0a3-0ccd-44ea-af78-c6633115d683'],
      order: 24,
    },
    {
      id: '05532574-c102-4228-89a8-55fff32ec6fc',
      type: 'task',
      title:
        'Create the landing/marketing page and host it on the beta channel',
      notes:
        'Reprehenderit anim consectetur anim dolor magna consequat excepteur tempor enim duis magna proident ullamco aute voluptate elit laborum mollit labore id ex lorem est mollit do qui ex labore nulla.\n\nUt proident elit proident adipisicing elit fugiat ex ullamco dolore excepteur excepteur labore laborum sunt ipsum proident magna ex voluptate laborum voluptate sint proident eu reprehenderit non excepteur quis eiusmod.',
      completed: true,
      dueDate: '2023-12-08T23:20:50.910Z',
      priority: 2,
      tags: ['a0bf42ca-c3a5-47be-8341-b9c0bb8ef270'],
      assignees: [],
      order: 25,
    },
    {
      id: 'b3917466-aa51-4293-9d5b-120b0ce6635c',
      type: 'task',
      title: 'Move dependency system to Yarn for easier package management',
      notes:
        'Ipsum officia mollit qui laboris sunt amet aliquip cupidatat minim non elit commodo eiusmod labore mollit pariatur aute reprehenderit ullamco occaecat enim pariatur aute amet occaecat incididunt irure ad ut.\n\nIncididunt cupidatat pariatur magna sint sit culpa ad cupidatat cillum exercitation consequat minim pariatur consectetur aliqua non adipisicing magna ad nulla ea do est nostrud eu aute id occaecat ut.',
      completed: false,
      dueDate: '2018-01-14T09:58:38.444Z',
      priority: 1,
      tags: [],
      assignees: ['56a3e7ce-01da-43fc-ab9f-a8a39fa980de'],
      order: 26,
    },
    {
      id: '2f2fb472-24d4-4a00-aa80-d513fa6c059c',
      type: 'task',
      title: 'Fix permission issues that the 0.0.7-alpha.2 has introduced',
      notes:
        'Dolor cupidatat do qui in tempor dolor magna magna ut dolor est aute veniam consectetur enim sunt sunt duis magna magna aliquip id reprehenderit dolor in veniam ullamco incididunt occaecat.\n\nId duis pariatur anim cillum est sint non veniam voluptate deserunt anim nostrud duis voluptate occaecat elit ut veniam voluptate do qui est ad velit irure sint lorem ullamco aliqua.',
      completed: true,
      dueDate: '2020-06-08T00:23:24.051Z',
      priority: 1,
      tags: ['91658b8a-f382-4b0c-a53f-e9390351c2c5'],
      assignees: ['65f1c421-83c5-4cdf-99da-d97794328679'],
      order: 27,
    },
    {
      id: '2fffd148-7644-466d-8737-7dde88c54154',
      type: 'task',
      title: 'Start promotions using the company account',
      notes:
        'Velit commodo pariatur ullamco elit sunt dolor quis irure amet tempor laboris labore tempor nisi consectetur ea proident dolore culpa nostrud esse amet commodo do esse laboris laboris in magna.\n\nAute officia labore minim laborum irure cupidatat occaecat laborum ex labore ipsum aliqua cillum do exercitation esse et veniam excepteur mollit incididunt ut qui irure culpa qui deserunt nostrud tempor.',
      completed: false,
      dueDate: '2024-01-27T11:17:52.198Z',
      priority: 1,
      tags: ['d3ef4226-ef2c-43b0-a986-3e3e07f32799'],
      assignees: ['b2e97a96-2f15-4e3d-aff5-4ddf2af924d4'],
      order: 28,
    },
    {
      id: '24a1034e-b4d6-4a86-a1ea-90516e87e810',
      type: 'task',
      title: 'Add more error pages - 401, 301, 303, 500 etc.',
      notes:
        'Exercitation eu in officia lorem commodo pariatur pariatur nisi consectetur qui elit in aliquip et ullamco duis nostrud aute laborum laborum est dolor non qui amet deserunt ex et aliquip.\n\nProident consectetur eu amet minim labore anim ad non aute duis eiusmod sit ad elit magna do aliquip aliqua laborum dolor laboris ea irure duis mollit fugiat tempor eu est.',
      completed: false,
      dueDate: '2024-06-24T04:38:28.087Z',
      priority: 1,
      tags: ['51483dd3-cb98-4400-9128-4bd66b455807'],
      assignees: ['7f5db993-ec36-412f-9db3-16d076a98807'],
      order: 29,
    },
  ];

  data = {
    tags: this.tags,
    members: this.members,
    tasks: this.tasks,
  };
}
