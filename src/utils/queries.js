export const createUserTable = `
CREATE TYPE user_type AS ENUM ('admin', 'attendee');
CREATE TABLE IF NOT EXISTS user_details(
    user_details_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(250),
    user_role user_type,
    PRIMARY KEY (user_details_id)
)
`;

export const createEventCategoryTable = `
CREATE TABLE IF NOT EXISTS event_categories(
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    title VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
)
`;

export const createEventTable = `
CREATE TABLE IF NOT EXISTS event(
    event_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    title VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    venue VARCHAR(100) NOT NULL,
    organizer VARCHAR(50) NOT NULL,
    event_image VARCHAR NOT NULL,
    category_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    PRIMARY KEY (event_id),
    FOREIGN KEY (category_id) REFERENCES event_categories (id)
);
`;

export const createAttendeesTable = `
CREATE TABLE IF NOT EXISTS attendees(
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    attendee_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    check_in VARCHAR,
    feedback VARCHAR,
    rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
    PRIMARY KEY (id),
    FOREIGN KEY (event_id) REFERENCES event (event_id),
    FOREIGN KEY (attendee_id) REFERENCES user_details (user_details_id)
)
`;

export const dropUserTable = 'DROP TABLE user_details';
export const dropEventCategoryTable = 'DROP TABLE event_categories';
export const dropAttendeesTable = 'DROP TABLE attendees';
export const dropEventTable = 'DROP TABLE event';
