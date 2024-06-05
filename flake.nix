{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/x86_64-linux";
  };
  outputs = {
    self,
    nixpkgs,
    systems,
  } @ inputs: let
    eachSystem = nixpkgs.lib.genAttrs (import systems);
    pkgsFor = eachSystem (system: (nixpkgs.legacyPackages.${system}));
  in {
    apps = eachSystem (system: let
      pkgs = pkgsFor.${system};
      jekyll-server = pkgs.writeShellApplication {
        name = "jekyll-server";
        runtimeInputs = [pkgs.jekyll];
        text = ''
          jekyll serve --watch --livereload "$@"
        '';
      };
    in {
      default = {
        type = "app";
        program = pkgs.lib.getExe jekyll-server;
      };
    });
  };
}
