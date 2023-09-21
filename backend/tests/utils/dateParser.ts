import {add} from 'date-fns';

export class Matcher {
    private match: RegExp;
    readonly handler: CallableFunction;

    constructor({match, handler}: { match: RegExp, handler: CallableFunction }) {
        this.match = match;
        this.handler = handler;
    }

    isAMatch(date: string): boolean {
        return date.match(this.match) !== null;
    }

    handle(date: string): Date {
        const match = date.match(this.match);
        const params = {
            match,
            groups: match?.groups as BaseMatchGroups
        }
        return this.handler(params);
    }
}

type BaseMatchGroups = {
    days: string | null,
    weekday: string | null,
}

class MatchersRegistry {
    private entries: Array<Matcher>;

    constructor() {
        this.entries = [
            new Matcher({
                match: /^tomorrow$/,
                handler: ({match, groups}: { match: RegExpMatchArray, groups: BaseMatchGroups }) => {
                    return add(new Date(), {days: 1});
                }
            }),
            new Matcher({
                match: /^in (?<days>\d+) days$/,
                handler: ({match, groups}: { match: RegExpMatchArray, groups: BaseMatchGroups }) => {
                    return add(new Date(), {days: Number(groups.days)});
                }
            }),
            new Matcher({
                match: /^next (?<weekday>monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/,
                handler: ({match, groups}: { match: RegExpMatchArray, groups: BaseMatchGroups }) => {
                    const weekdays = {
                        monday: 1,
                        tuesday: 2,
                        wednesday: 3,
                        thursday: 4,
                        friday: 5,
                        saturday: 6,
                        sunday: 0,
                    };
                    const todayIndex = new Date().getDay();
                    // @ts-ignore: Object is possibly 'null'
                    const weekDayIndex = weekdays[groups.weekday];
                    let daysToAdd = 0;
                    if (todayIndex == weekDayIndex) {
                        daysToAdd = 7;
                    }
                    if (todayIndex < weekDayIndex) {
                        daysToAdd = weekDayIndex - todayIndex;
                    }
                    if (todayIndex > weekDayIndex) {
                        const remainingWeekDays = 7 - todayIndex;
                        daysToAdd = remainingWeekDays + weekDayIndex;
                    }
                    return add(new Date(), {days: daysToAdd});
                }
            })
        ];
    }

    find(date: string): Matcher {
        for (const matcher of this.entries) {
            if (matcher.isAMatch(date)) {
                return matcher;
            }
        }
        throw Error('No matcher found');
    }
}

export default class DateParser {
    private registry: MatchersRegistry;

    constructor() {
        this.registry = new MatchersRegistry();
    }

    parse(date: string): Date {
        const matcher = this.registry.find(date);

        return matcher.handle(date);
    }
}