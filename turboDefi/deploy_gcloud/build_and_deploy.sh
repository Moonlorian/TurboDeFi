#!/bin/bash

# Constantes
PROJECT_ID_DEVNET=turbodefi-devnet
PROJECT_ID_MAINNET=turbodefi-mainnet

YAML_FILE=app-devnet.yaml

NON_STATIC_VERSION=dev
STATIC_VERSION=maintenance
VERSION=$NON_STATIC_VERSION

APP_ENGINE_SERVICE=default

BUILD_AND_DEPLOY=0 # 1 => build and deploy, 2 only deploy, 3 migrate traffic only
WITH_TRAFFIC=0

PROJECT_ID=$PROJECT_ID_DEVNET

echo "###########################"
echo "# TURBODEFI build and deploy #"
echo "###########################"
read -p "Indica si quieres desplegar en mainnet o en devnet:
> [1] devnet
> [2] mainnet
> : " option

if [ "$option" == 1 ]; then
  PROJECT_ID=$PROJECT_ID_DEVNET
  YAML_FILE=app-devnet.yaml
  echo "Se ha seleccionado devnet ${PROJECT_ID}"
elif [ "$option" == 2 ]; then
  PROJECT_ID=$PROJECT_ID_MAINNET
  YAML_FILE=app-mainnet.yaml
  echo "Se ha seleccionado mainnet ${PROJECT_ID}"
else
  echo "No se ha elegido ninguna opción válida"
  exit 1
fi

read -p "Indica si quieres desplegar en construir y desplegar, sólo desplegar o sólo migrar tráfico:
> [1] construir y desplegar
> [2] sólo desplegar
> [3] sólo migrar tráfico
> : " option

if [ "$option" == 1 ]; then
  BUILD_AND_DEPLOY=1
  echo "Se ha elegido construir y desplegar"
elif [ "$option" == 2 ]; then
  BUILD_AND_DEPLOY=2
  echo "Se ha elegido sólo desplegar"
elif [ "$option" == 3 ]; then
  BUILD_AND_DEPLOY=3
  echo "Se ha elegido sólo migrar tráfico"
else
  echo "No se ha elegido ninguna opción válida"
  exit 1
fi

# configuramos el proyecto
gcloud config set project ${PROJECT_ID}

# Ahora ya desplegamos o migramos tráfico
if [ "$BUILD_AND_DEPLOY" == 3 ]; then
  read -p "Elige ddónde quieres el 100% del tráfico:
  > [1] static
  > [2] non-static
  > : " option

  if [ "$option" == 1 ]; then
    echo "Migrando tráfico todo a ${STATIC_VERSION}..."
    gcloud app services set-traffic ${APP_ENGINE_SERVICE} --splits ${STATIC_VERSION}=1
    echo "hecho"
  elif [ "$option" == 2 ]; then
    echo "Migrando tráfico todo a ${NON_STATIC_VERSION}..."
        gcloud app services set-traffic ${APP_ENGINE_SERVICE} --splits ${NON_STATIC_VERSION}=1
        echo "hecho"
  else
    echo "No se ha elegido ninguna opción válida"
    exit 1
  fi
else
  read -p "Deseas desplegar con tráfico o sin tráfico:
    > [1] Con tráfico
    > [2] Sin tráfico
    > : " option


    read -p "Elige la versión que quieres desplegar:
      > [1] static
      > [2] non-static
      > : " option2

  # Con tráfico
  if [ "$option" == 1 ]; then
    if [ "$option2" == 1 ]; then
      VERSION=$STATIC_VERSION
    else
      VERSION=$NON_STATIC_VERSION
    fi

    cd ..
    if [ "$BUILD_AND_DEPLOY" == 1 ]; then
      echo "build and deploy"
      rm -rf deploy_gcloud/build
    fi
    if [ "$VERSION" == "$STATIC_VERSION" ]; then
      mkdir -p deploy_gcloud/build
      rm -rf deploy_gcloud/build/*
      cp deploy_gcloud/static/index.html deploy_gcloud/build/
      cp deploy_gcloud/static/banner.jpg deploy_gcloud/build/
    else
      FILE=package.json
      if  [ -f "$FILE" ]; then
        if [ "$PROJECT_ID" == "$PROJECT_ID_MAINNET" ]; then
          cp src/config/config.mainnet.tsx src/config/index.tsx
        else
          cp src/config/config.devnet.tsx src/config/index.tsx
        fi
        yarn build
      fi
      rm -rf deploy_gcloud/build
      cp -r build deploy_gcloud/
    fi
    cp deploy_gcloud/${YAML_FILE} deploy_gcloud/build/app.yaml
    # Desplegamos con el yaml que toca y sin tráfico
    cd deploy_gcloud/build
    gcloud app deploy --version=${VERSION} --promote
  else
    cd ..
    if [ "$option2" == 1 ]; then
      VERSION=$STATIC_VERSION
    else
      VERSION=$NON_STATIC_VERSION
    fi

    if [ "$BUILD_AND_DEPLOY" == 1 ]; then
      mkdir -p build
    fi

    if [ "$VERSION" == "$STATIC_VERSION" ]; then
      mkdir -p deploy_gcloud/build
      rm -rf deploy_gcloud/build/*
      cp deploy_gcloud/static/index.html deploy_gcloud/build/
      cp deploy_gcloud/static/banner.jpg deploy_gcloud/build/
    else
      if [ "$BUILD_AND_DEPLOY" == 1 ]; then
        FILE=package.json
        if  [ -f "$FILE" ]; then
          if [ "$PROJECT_ID" == "$PROJECT_ID_MAINNET" ]; then
            cp src/config/config.mainnet.tsx src/config/config.tsx
          else
            cp src/config/config.devnet.tsx src/config/config.tsx
          fi
          yarn build
        fi
      fi
      rm -rf deploy_gcloud/build
      cp -r build deploy_gcloud/
    fi
    cp deploy_gcloud/${YAML_FILE} deploy_gcloud/build/app.yaml
    # Desplegamos con el yaml que toca y sin tráfico
    cd deploy_gcloud/build
    gcloud app deploy --version=${VERSION} --no-promote
  fi
fi