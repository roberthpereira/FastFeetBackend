module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'fastfeet',
  database: 'fastfeet',
  port: '5433',
  define: {
    timestamps: true, // garante que será criado um atributo: created_at e updated_at na tabela do banco de dados.
    underscored: true, // permite o ORM criar nome de tabelas como products_item
    underscoredAll: true, // permite o ORM criar nome dos atributos com caixa baixa e _ em vez de camelCase, pois esse é a convenção de escrita no banco de dados
  },
};
