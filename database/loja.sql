-- =====================================================
--  BANCO DE DADOS: loja
--  Pronto para importar no phpMyAdmin (XAMPP)
--  Passos:
--    1. Abra o phpMyAdmin (http://localhost/phpmyadmin)
--    2. Clique em "Novo" para criar o banco "loja"
--    3. Selecione o banco "loja" e clique em "Importar"
--    4. Escolha este arquivo e clique em "Executar"
-- =====================================================

CREATE DATABASE IF NOT EXISTS loja
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE loja;

-- -----------------------------------------------------
--  Tabela: categorias
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

-- -----------------------------------------------------
--  Tabela: produtos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS produtos (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(150) NOT NULL,
  descricao    TEXT,
  preco        DECIMAL(10, 2) NOT NULL,
  estoque      INT           NOT NULL DEFAULT 0,
  categoria_id INT,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

-- -----------------------------------------------------
--  Dados de exemplo: categorias
-- -----------------------------------------------------
INSERT INTO categorias (nome) VALUES
  ('Eletrônicos'),
  ('Roupas'),
  ('Alimentos'),
  ('Livros'),
  ('Esportes');

-- -----------------------------------------------------
--  Dados de exemplo: produtos
-- -----------------------------------------------------
INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id) VALUES
  ('Smartphone Galaxy', 'Tela 6.5", 128GB, câmera 50MP',       2499.90,  15, 1),
  ('Fone Bluetooth',   'Sem fio, cancelamento de ruído',         349.90,  40, 1),
  ('Notebook Lenovo',  'Intel i5, 8GB RAM, SSD 512GB',          3899.00,   8, 1),
  ('Camiseta Básica',  'Algodão 100%, disponível em P/M/G/GG',    49.90, 120, 2),
  ('Calça Jeans',      'Corte slim, lavagem escura',             189.90,  60, 2),
  ('Tênis Running',    'Solado com amortecimento, leve',         399.90,  35, 5),
  ('Arroz Integral',   'Pacote 1kg, orgânico',                    12.50, 200, 3),
  ('Azeite Extra Virgem', 'Importado, acidez 0.3%, 500ml',        38.90,  80, 3),
  ('Clean Code',       'Robert C. Martin — boas práticas de código', 89.90, 25, 4),
  ('O Programador Pragmático', 'Hunt & Thomas — edição 20 anos', 94.90,  18, 4);
