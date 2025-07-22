export const createUuid = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
`;

export const createUserTable = `
CREATE TABLE IF NOT EXISTS user_details(
    user_details_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    avatar VARCHAR(100) NOT NULL,
    user_role VARCHAR(100) DEFAULT 'attendee',
    PRIMARY KEY (user_details_id)
)
`;

export const createEventCategoryTable = `
CREATE TABLE IF NOT EXISTS event_categories(
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    title VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (id)
)
`;

export const createEventTable = `
CREATE TABLE IF NOT EXISTS event(
    event_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    title VARCHAR(50) NOT NULL UNIQUE,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    venue VARCHAR(100) NOT NULL,
    organizer VARCHAR(50) NOT NULL,
    event_image VARCHAR NOT NULL,
    category_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    category_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (event_id),
    FOREIGN KEY (category_id) REFERENCES event_categories (id),
    FOREIGN KEY (category_name) REFERENCES event_categories (title)
);
`;

export const createAttendeesTable = `
CREATE TABLE IF NOT EXISTS attendees(
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    event_name VARCHAR NOT NULL,
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
