//

/**
 * These are scripts used for manual creating and populating tables
 */

const createProducts = `
create table products (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    price integer
)
`;

const createStocks = `
create table stocks (
  product_id uuid,
  count integer,
  foreign key ("product_id") references "products" ("id")
)
`;

const populateProducts = `
insert into products (title, description, price) values
('Apple', 'Green, fresh, acid', 2),
('Orange', 'Orange, juicy, thin rind', 7),
('Banana', 'Yellow, tasteless', 1),
('Melon', 'Yellow, honey', 5),
('Tomato', 'Red, not a fruit, so not sure why we sell it', 5)
`;
// The following inserts a number per each uniq id in products table
// I just too lazy for copy-pasting uuids
const populateStocks = `
  insert into stocks (product_id, count)
  select id, row_number() OVER (ORDER BY id) as count from products from products
`;
