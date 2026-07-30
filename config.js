const config = {
    user_db: 'postgres',
    host_db: 'localhost',
    database_db: 'apiproductos',
    password_db: 'Xenon777',
    port_db: 5432,
    server_port: 3000,
    rows_per_page: 10,
    product_types: ['cactus', 'clavel', 'ficus', 'lirio'],
    select_fields_products: 'SELECT product.product_id as product_id, product.name as name, product.image as image, product_detail.price as price, product_detail.discount as discount, product_detail.stock as stock, product_detail.currency as currency, product_detail.description as description, product.product_type as type',
    access_control_allow_origin: 'http://127.0.0.1:5501'
}

export default config