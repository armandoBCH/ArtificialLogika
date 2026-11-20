-- Captura de celular de cada proyecto del portafolio (2026-11-20).
-- La usan la tira "Y así se ven en el celular" de la home (entra sola cualquier
-- proyecto activo que la tenga) y la galería de la página de cada proyecto.
alter table public.portfolio_projects add column if not exists image_url_mobile text;

-- Las 6 capturas que vivían fijas en lib/data/capturas-celular.ts pasan a la base.
update public.portfolio_projects set image_url_mobile = '/trabajos/celular/rago-automotores.webp'    where id = '0c0ca3b4-c649-4729-a1e4-aa287371dfd0' and image_url_mobile is null;
update public.portfolio_projects set image_url_mobile = '/trabajos/celular/optica-agb.webp'          where id = '384e8b36-6872-441c-a6a2-00db76022304' and image_url_mobile is null;
update public.portfolio_projects set image_url_mobile = '/trabajos/celular/aliverti.webp'            where id = 'd771d6b2-11fb-4158-9b17-74da103e0ea5' and image_url_mobile is null;
update public.portfolio_projects set image_url_mobile = '/trabajos/celular/expresion-honesta.webp'   where id = 'd7e3a1f0-8b2c-4d5e-a9f1-6c4e8d2b7a30' and image_url_mobile is null;
update public.portfolio_projects set image_url_mobile = '/trabajos/celular/boda-carlos-y-jenlys.webp' where id = 'b442e93b-9476-4e78-a959-ea020187d654' and image_url_mobile is null;
update public.portfolio_projects set image_url_mobile = '/trabajos/celular/tabaqueria-amaranta.webp' where id = '4539d085-9e56-4d6c-99c7-96d4d5fa170b' and image_url_mobile is null;
