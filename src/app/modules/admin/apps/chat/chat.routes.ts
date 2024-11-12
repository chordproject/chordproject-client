import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';
import { ChatsComponent } from './chats/chats.component';
import { ConversationComponent } from './conversation/conversation.component';
import { EmptyConversationComponent } from './empty-conversation/empty-conversation.component';

/**
 * Conversation resolver
 *
 * @param route
 * @param state
 */
const conversationResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const chatService = inject(ChatService);
    const router = inject(Router);

    return chatService.getChatById(route.paramMap.get('id')).pipe(
        // Error here means the requested chat is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};

export default [
    {
        path: '',
        component: ChatComponent,
        resolve: {
            chats: () => inject(ChatService).getChats(),
            contacts: () => inject(ChatService).getContacts(),
            profile: () => inject(ChatService).getProfile(),
        },
        children: [
            {
                path: '',
                component: ChatsComponent,
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: EmptyConversationComponent,
                    },
                    {
                        path: ':id',
                        component: ConversationComponent,
                        resolve: {
                            conversation: conversationResolver,
                        },
                    },
                ],
            },
        ],
    },
] as Routes;
