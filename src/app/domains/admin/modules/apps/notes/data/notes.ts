import { Injectable } from '@angular/core';
import { add, set, sub } from 'date-fns';
import { Note } from '@/app/domains/admin/modules/apps/notes/data/model';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private now = new Date();
  private notes: Note[] = [
    {
      id: '8f011ac5-b71c-4cd7-a317-857dcd7d85e0',
      title: 'Find a new company name',
      content:
        'We need to find a new company name that reflects our values and mission. The name should be catchy, easy to remember, and available as a domain name.',
      tasks: null,
      image: null,
      reminder: null,
      labels: ['Work'],
      archived: false,
      createdAt: sub(set(this.now, { hours: 10, minutes: 19 }), {
        days: 98,
      }).toDateString(),
      updatedAt: null,
    },
    {
      id: 'ced0a1ce-051d-41a3-b080-e2161e4ae621',
      title: 'Vacation Photos',
      content: 'Send the photos of last summer to John',
      tasks: null,
      image: 'images/cards/14-640x480.jpg',
      reminder: null,
      labels: ['Personal', 'Tasks'],
      archived: false,
      createdAt: sub(set(this.now, { hours: 15, minutes: 37 }), {
        days: 80,
      }).toDateString(),
      updatedAt: null,
    },
    {
      id: 'd3ac02a9-86e4-4187-bbd7-2c965518b3a3',
      title: 'Design Update',
      content: 'Update the design of the theme',
      tasks: null,
      image: null,
      reminder: null,
      labels: ['Priority'],
      archived: false,
      createdAt: sub(set(this.now, { hours: 19, minutes: 27 }), {
        days: 74,
      }).toDateString(),
      updatedAt: sub(set(this.now, { hours: 15, minutes: 36 }), {
        days: 50,
      }).toDateString(),
    },
    {
      id: '89861bd4-0144-4bb4-8b39-332ca10371d5',
      title: 'Theming Support',
      content: 'Theming support for all apps',
      tasks: null,
      image: null,
      reminder: add(set(this.now, { hours: 12, minutes: 34 }), {
        days: 50,
      }).toDateString(),
      labels: ['Work'],
      archived: false,
      createdAt: sub(set(this.now, { hours: 12, minutes: 34 }), {
        days: 59,
      }).toDateString(),
      updatedAt: null,
    },
    {
      id: 'ffd20f3c-2d43-4c6b-8021-278032fc9e92',
      title: 'Gift Ideas',
      content:
        "Stephanie's birthday is coming and I need to pick a present for her. Take a look at the below list and buy one of them (or all of them)",
      tasks: [
        {
          id: '330a924f-fb51-48f6-a374-1532b1dd353d',
          content: 'Scarf',
          completed: false,
        },
        {
          id: '781855a6-2ad2-4df4-b0af-c3cb5f302b40',
          content: 'A new bike helmet',
          completed: true,
        },
        {
          id: 'bcb8923b-33cd-42c2-9203-170994fa24f5',
          content: 'Necklace',
          completed: false,
        },
        {
          id: '726bdf6e-5cd7-408a-9a4f-0d7bb98c1c4b',
          content: 'Flowers',
          completed: false,
        },
      ],
      image: null,
      reminder: null,
      labels: ['Family'],
      archived: false,
      createdAt: sub(set(this.now, { hours: 16, minutes: 4 }), {
        days: 47,
      }).toDateString(),
      updatedAt: null,
    },
    {
      id: '71d223bb-abab-4183-8919-cd3600a950b4',
      title: 'Shopping list',
      content: 'Buy the groceries for the week',
      tasks: [
        {
          id: 'e3cbc986-641c-4448-bc26-7ecfa0549c22',
          content: 'Bread',
          completed: true,
        },
        {
          id: '34013111-ab2c-4b2f-9352-d2ae282f57d3',
          content: 'Milk',
          completed: false,
        },
        {
          id: '0fbdea82-cc79-4433-8ee4-54fd542c380d',
          content: 'Onions',
          completed: false,
        },
        {
          id: '66490222-743e-4262-ac91-773fcd98a237',
          content: 'Coffee',
          completed: true,
        },
        {
          id: 'ab367215-d06a-48b0-a7b8-e161a63b07bd',
          content: 'Toilet Paper',
          completed: true,
        },
      ],
      image: null,
      reminder: add(set(this.now, { hours: 10, minutes: 44 }), {
        days: 35,
      }).toDateString(),
      labels: ['Tasks'],
      archived: false,
      createdAt: sub(set(this.now, { hours: 10, minutes: 44 }), {
        days: 35,
      }).toDateString(),
      updatedAt: null,
    },
    {
      id: '11fbeb98-ae5e-41ad-bed6-330886fd7906',
      title: 'Keynote Schedule',
      content: 'Schedule for the keynote speech at the conference',
      tasks: [
        {
          id: '2711bac1-7d8a-443a-a4fe-506ef51d3fcb',
          content: 'Breakfast',
          completed: true,
        },
        {
          id: 'e3a2d675-a3e5-4cef-9205-feeccaf949d7',
          content: 'Opening ceremony',
          completed: true,
        },
        {
          id: '7a721b6d-9d85-48e0-b6c3-f927079af582',
          content: 'Talk 1: How we did it!',
          completed: true,
        },
        {
          id: 'bdb4d5cd-5bb8-45e2-9186-abfd8307e429',
          content: 'Talk 2: How can you do it!',
          completed: false,
        },
        {
          id: 'c8293bb4-8ab4-4310-bbc2-52ecf8ec0c54',
          content: 'Lunch break',
          completed: false,
        },
      ],
      image: null,
      reminder: add(set(this.now, { hours: 11, minutes: 27 }), {
        days: 14,
      }).toDateString(),
      labels: ['Tasks', 'Work'],
      archived: false,
      createdAt: sub(set(this.now, { hours: 11, minutes: 27 }), {
        days: 24,
      }).toDateString(),
      updatedAt: null,
    },
    {
      id: 'd46dee8b-8761-4b6d-a1df-449d6e6feb6a',
      title: 'Retirement Party',
      content: "Organize the dad's surprise retirement party",
      tasks: null,
      image: null,
      reminder: add(set(this.now, { hours: 14, minutes: 56 }), {
        days: 25,
      }).toDateString(),
      labels: ['Family'],
      archived: false,
      createdAt: sub(set(this.now, { hours: 14, minutes: 56 }), {
        days: 20,
      }).toDateString(),
      updatedAt: null,
    },
    {
      id: '6bc9f002-1675-417c-93c4-308fba39023e',
      title: 'Plan the road trip',
      content: 'Plan the road trip for the next summer vacation with friends',
      tasks: null,
      image: 'images/cards/17-640x480.jpg',
      reminder: null,
      labels: ['Friends', 'Tasks'],
      archived: false,
      createdAt: sub(set(this.now, { hours: 9, minutes: 32 }), {
        days: 15,
      }).toDateString(),
      updatedAt: sub(set(this.now, { hours: 17, minutes: 6 }), {
        days: 12,
      }).toDateString(),
    },
    {
      id: '15188348-78aa-4ed6-b5c2-028a214ba987',
      title: 'Office Address',
      content: '933 8th Street Stamford, CT 06902',
      tasks: null,
      image: null,
      reminder: null,
      labels: ['Work'],
      archived: false,
      createdAt: sub(set(this.now, { hours: 20, minutes: 5 }), {
        days: 12,
      }).toDateString(),
      updatedAt: null,
    },
    {
      id: '1dbfc685-1a0a-4070-9ca7-ed896c523037',
      title: 'Tasks',
      content: 'Things to do this week',
      tasks: [
        {
          id: '004638bf-3ee6-47a5-891c-3be7b9f3df09',
          content: 'Wash the dishes',
          completed: true,
        },
        {
          id: '86e6820b-1ae3-4c14-a13e-35605a0d654b',
          content: 'Walk the dog',
          completed: false,
        },
      ],
      image: null,
      reminder: add(set(this.now, { hours: 13, minutes: 43 }), {
        days: 2,
      }).toDateString(),
      labels: ['Personal'],
      archived: false,
      createdAt: sub(set(this.now, { hours: 13, minutes: 43 }), {
        days: 7,
      }).toDateString(),
      updatedAt: null,
    },
    {
      id: '49548409-90a3-44d4-9a9a-f5af75aa9a66',
      title: 'Dinner',
      content: 'Dinner with parents',
      tasks: null,
      image: null,
      reminder: null,
      labels: ['Family', 'Priority'],
      archived: false,
      createdAt: sub(set(this.now, { hours: 7, minutes: 12 }), {
        days: 2,
      }).toDateString(),
      updatedAt: null,
    },
    {
      id: 'c6d13a35-500d-4491-a3f3-6ca05d6632d3',
      title: 'Medicine Cabinet',
      content: 'Re-fill the medicine cabinet',
      tasks: null,
      image: null,
      reminder: null,
      labels: ['Personal', 'Priority'],
      archived: true,
      createdAt: sub(set(this.now, { hours: 17, minutes: 14 }), {
        days: 100,
      }).toDateString(),
      updatedAt: null,
    },
    {
      id: '5e8a890f-d159-49f3-871b-ba19ce57517e',
      title: 'Icons Pack',
      content: 'Update the icons pack',
      tasks: null,
      image: null,
      reminder: null,
      labels: ['Work'],
      archived: true,
      createdAt: sub(set(this.now, { hours: 10, minutes: 29 }), {
        days: 85,
      }).toDateString(),
      updatedAt: null,
    },
    {
      id: '46214383-f8e7-44da-aa2e-0b685e0c5027',
      title: 'Team Meeting',
      content: 'Talk about the future of the web apps',
      tasks: null,
      image: null,
      reminder: null,
      labels: ['Work', 'Tasks'],
      archived: true,
      createdAt: sub(set(this.now, { hours: 15, minutes: 30 }), {
        days: 69,
      }).toDateString(),
      updatedAt: null,
    },
  ];

  data = {
    notes: this.notes,
  };
}
