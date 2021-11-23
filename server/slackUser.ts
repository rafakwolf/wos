export class SlackUser {

    constructor(
        id: string,
        name: string,
        deleted: boolean,
        real_name: string,
        tz: string,
        status_text: string,
        status_emoji: string,
        image_512: string) {
        this.id = id;
        this.name = name;
        this.deleted = deleted ? "S" : "N";
        this.real_name = real_name;
        this.tz = tz;
        this.status_text = status_text;
        this.status_emoji = status_emoji;
        this.image_512 = image_512;
    }

    id: string;
    name: string;
    deleted: string;
    real_name: string;
    tz: string;
    status_text: string;
    status_emoji: string;
    image_512: string;
}