PGDMP      -                {            dataBaseTCC    16.0    16.0 +               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16399    dataBaseTCC    DATABASE     �   CREATE DATABASE "dataBaseTCC" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Portuguese_Brazil.1252';
    DROP DATABASE "dataBaseTCC";
                TesteTcc    false            �            1259    16439    alarmes    TABLE     �   CREATE TABLE public.alarmes (
    id integer NOT NULL,
    nome character varying(55),
    valor_maximo double precision,
    alarme_alto double precision,
    alarme_baixo double precision
);
    DROP TABLE public.alarmes;
       public         heap    postgres    false            �            1259    16438    alarmes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.alarmes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.alarmes_id_seq;
       public          postgres    false    222                       0    0    alarmes_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.alarmes_id_seq OWNED BY public.alarmes.id;
          public          postgres    false    221            �            1259    16430    dadossensores    TABLE     �   CREATE TABLE public.dadossensores (
    id integer NOT NULL,
    data_hora timestamp without time zone,
    num_sensor integer,
    valor double precision NOT NULL
);
 !   DROP TABLE public.dadossensores;
       public         heap    postgres    false            �            1259    16429    dadossensores_id_seq    SEQUENCE     �   CREATE SEQUENCE public.dadossensores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.dadossensores_id_seq;
       public          postgres    false    220                       0    0    dadossensores_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.dadossensores_id_seq OWNED BY public.dadossensores.id;
          public          postgres    false    219            �            1259    16446    historico_alarmes    TABLE     �   CREATE TABLE public.historico_alarmes (
    id_historico_alarmes integer NOT NULL,
    num_sensor_alarme integer,
    valor_alarme double precision,
    tipo_alarme integer,
    verificado boolean,
    data_alarme timestamp without time zone
);
 %   DROP TABLE public.historico_alarmes;
       public         heap    postgres    false            �            1259    16445 *   historico_alarmes_id_historico_alarmes_seq    SEQUENCE     �   CREATE SEQUENCE public.historico_alarmes_id_historico_alarmes_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE public.historico_alarmes_id_historico_alarmes_seq;
       public          postgres    false    224                       0    0 *   historico_alarmes_id_historico_alarmes_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.historico_alarmes_id_historico_alarmes_seq OWNED BY public.historico_alarmes.id_historico_alarmes;
          public          postgres    false    223            �            1259    16423    sensores    TABLE     	  CREATE TABLE public.sensores (
    id integer NOT NULL,
    data_hora timestamp without time zone,
    tipo integer,
    num_sensor integer,
    nome character varying(180),
    status boolean,
    id_usuario integer NOT NULL,
    padrao_alarme integer NOT NULL
);
    DROP TABLE public.sensores;
       public         heap    postgres    false            �            1259    16422    sensores_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sensores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.sensores_id_seq;
       public          postgres    false    218                       0    0    sensores_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.sensores_id_seq OWNED BY public.sensores.id;
          public          postgres    false    217            �            1259    16411    usuario    TABLE     �   CREATE TABLE public.usuario (
    id integer NOT NULL,
    nome_usuario character varying(50),
    senha character varying(180),
    nome_completo character varying(180),
    email character varying(180),
    grupo integer
);
    DROP TABLE public.usuario;
       public         heap    postgres    false            �            1259    16410    usuario_id_seq    SEQUENCE     �   CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.usuario_id_seq;
       public          postgres    false    216                       0    0    usuario_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;
          public          postgres    false    215            g           2604    16442 
   alarmes id    DEFAULT     h   ALTER TABLE ONLY public.alarmes ALTER COLUMN id SET DEFAULT nextval('public.alarmes_id_seq'::regclass);
 9   ALTER TABLE public.alarmes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221    222            f           2604    16433    dadossensores id    DEFAULT     t   ALTER TABLE ONLY public.dadossensores ALTER COLUMN id SET DEFAULT nextval('public.dadossensores_id_seq'::regclass);
 ?   ALTER TABLE public.dadossensores ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            h           2604    16449 &   historico_alarmes id_historico_alarmes    DEFAULT     �   ALTER TABLE ONLY public.historico_alarmes ALTER COLUMN id_historico_alarmes SET DEFAULT nextval('public.historico_alarmes_id_historico_alarmes_seq'::regclass);
 U   ALTER TABLE public.historico_alarmes ALTER COLUMN id_historico_alarmes DROP DEFAULT;
       public          postgres    false    224    223    224            e           2604    16426    sensores id    DEFAULT     j   ALTER TABLE ONLY public.sensores ALTER COLUMN id SET DEFAULT nextval('public.sensores_id_seq'::regclass);
 :   ALTER TABLE public.sensores ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            d           2604    16414 
   usuario id    DEFAULT     h   ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);
 9   ALTER TABLE public.usuario ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    216    216                      0    16439    alarmes 
   TABLE DATA           T   COPY public.alarmes (id, nome, valor_maximo, alarme_alto, alarme_baixo) FROM stdin;
    public          postgres    false    222   l0                 0    16430    dadossensores 
   TABLE DATA           I   COPY public.dadossensores (id, data_hora, num_sensor, valor) FROM stdin;
    public          postgres    false    220   �0                 0    16446    historico_alarmes 
   TABLE DATA           �   COPY public.historico_alarmes (id_historico_alarmes, num_sensor_alarme, valor_alarme, tipo_alarme, verificado, data_alarme) FROM stdin;
    public          postgres    false    224   �4       
          0    16423    sensores 
   TABLE DATA           l   COPY public.sensores (id, data_hora, tipo, num_sensor, nome, status, id_usuario, padrao_alarme) FROM stdin;
    public          postgres    false    218   �4                 0    16411    usuario 
   TABLE DATA           W   COPY public.usuario (id, nome_usuario, senha, nome_completo, email, grupo) FROM stdin;
    public          postgres    false    216   5                  0    0    alarmes_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.alarmes_id_seq', 1, true);
          public          postgres    false    221                       0    0    dadossensores_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.dadossensores_id_seq', 180, true);
          public          postgres    false    219                       0    0 *   historico_alarmes_id_historico_alarmes_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('public.historico_alarmes_id_historico_alarmes_seq', 1, false);
          public          postgres    false    223                       0    0    sensores_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.sensores_id_seq', 1, true);
          public          postgres    false    217                        0    0    usuario_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.usuario_id_seq', 1, true);
          public          postgres    false    215            u           2606    16444    alarmes alarmes_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.alarmes
    ADD CONSTRAINT alarmes_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.alarmes DROP CONSTRAINT alarmes_pkey;
       public            postgres    false    222            q           2606    16435     dadossensores dadossensores_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.dadossensores
    ADD CONSTRAINT dadossensores_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.dadossensores DROP CONSTRAINT dadossensores_pkey;
       public            postgres    false    220            w           2606    16451 (   historico_alarmes historico_alarmes_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.historico_alarmes
    ADD CONSTRAINT historico_alarmes_pkey PRIMARY KEY (id_historico_alarmes);
 R   ALTER TABLE ONLY public.historico_alarmes DROP CONSTRAINT historico_alarmes_pkey;
       public            postgres    false    224            o           2606    16428    sensores sensores_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.sensores
    ADD CONSTRAINT sensores_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.sensores DROP CONSTRAINT sensores_pkey;
       public            postgres    false    218            k           2606    16420     usuario usuario_nome_usuario_key 
   CONSTRAINT     c   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nome_usuario_key UNIQUE (nome_usuario);
 J   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_nome_usuario_key;
       public            postgres    false    216            m           2606    16418    usuario usuario_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_pkey;
       public            postgres    false    216            r           1259    16437    idx_data_hora    INDEX     L   CREATE INDEX idx_data_hora ON public.dadossensores USING btree (data_hora);
 !   DROP INDEX public.idx_data_hora;
       public            postgres    false    220            i           1259    16421    idx_nome_usuario    INDEX     L   CREATE INDEX idx_nome_usuario ON public.usuario USING btree (nome_usuario);
 $   DROP INDEX public.idx_nome_usuario;
       public            postgres    false    216            s           1259    16436    idx_num_sensor    INDEX     N   CREATE INDEX idx_num_sensor ON public.dadossensores USING btree (num_sensor);
 "   DROP INDEX public.idx_num_sensor;
       public            postgres    false    220               !   x�3�I-.IU�466�46bC�=... V�@         �  x�m�͕�0E�YE���b-�.�E���ǉ�I��)��k�)���?���O[��ɩ��b������L��5��x-��|-��z-��~-�g�^�}����m�������� ��#� ��E0H>r��\���C� �h%����-$��wYDH6���	�g�bBr�*"$���Ǯ"B򱫈���Tń�I�}򌹅���t�&(D�}!!9I�ׄ���5��dߴ9S/�S6A!�71�N�ouR<�MP�>\��t!!�Ev!!9I��t��dW9R.c�'��'o��O�HL��T?+[|�D���S$��=�"�|����c��H$�L�)ɮ����䋩����z!qP)��! Dm
�^@H>�7t��3m
I=v���SDH~��4ń�&SLH &$���[�JKL�>���ߝ%&��o�Ͻ���-!!�=�i		��^BB�B���hBBr�- $n��]B�ҏ�,�h[@Hq�m!!��������! $FR�&"4;�l_��_"2�-~����������c�t��E.!�ؗ�����%"4�]&�<��Ӳ��X����XⲨ�|�nU`��jY\h,kY`hlkYdh��iMhh��*6�X�����b�4��F�S���1d������F�M�h�s5�bC��e_��y�(p�{�u6jl�CcYg�!'�l4{R�E�! +m4Pe����N;�S�=��O�F��h�#.[mT.U��h�/{m4�d��ƈ��F�e�h�_���i'�Sb�*����b����j��v?����[Q}��ox��a��p�-�����4v:<�\������_�.<T��Р��Cc�!84X��� �C���!:���SO�����Иp���bCEu�-�Z����V{7-St��Mѡ���}Y��Sc�+Sth�Lѡ1�Z\��И�-��0�hcl;��P�[�C�O�%<�����8Kph�����=�Kx�q��C�|	-�`#:4^e�"ou�SJ� ��`X            x������ � �      
   ;   x�3�4202�54�54V04�21�26�4�4�I-.IU(I�+>�8���ӐӐ+F���  ��         C   x�3�,����442�2�3K�srS3S9KR�KRCRsRsSK�2�s3s���s9��b���� o(�     