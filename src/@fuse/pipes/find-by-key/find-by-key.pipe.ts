import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fuseFindByKey',
    standalone: true,
})
export class FuseFindByKeyPipe implements PipeTransform {
    transform<T extends Record<string, unknown>>(
        value: T[] | null | undefined,
        key: keyof T,
        target: unknown
    ): T | undefined {
        return value?.find((item) => item[key] === target);
    }
}