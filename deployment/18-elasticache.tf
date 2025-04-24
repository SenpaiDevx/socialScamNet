resource "aws_elasticache_subnet_group" "elasticache_subnet_group" {
  name       = "${local.prefix}-subnet-elasticache-group"
  subnet_ids = [aws_subnet.private_subnet_a.id, aws_subnet.private_subnet_b.id]
}

resource "aws_elasticache_replication_group" "socialscamnet_redis_cluster" {
  automatic_failover_enabled = true
  replication_group_id       = "${local.prefix}-redis"
  node_type                  = var.elasticache_node_type
  number_cache_clusters      = 2
  parameter_group_name       = var.elasticache_parameter_group_name
  port                       = 6379
  multi_az_enabled           = true
  subnet_group_name          = aws_elasticache_subnet_group.elasticache_subnet_group.name
  security_group_ids         = [aws_security_group.elasticache_sg.id]
  replication_group_description = "Redis elasticache replication group"

  depends_on = [
    aws_security_group.elasticache_sg
  ]
  # https://developer.hashicorp.com/terraform/cli/state/taint
  provisioner "local-exec" { #latest execution format for sh files -> https://developer.hashicorp.com/terraform/language/resources/provisioners/local-exec
    command = "./userdata/update-env-file.sh" 
    interpreter = [ "PowerShell", "-Command" ]

    environment = {
      ELASTICACHE_ENDPOINT = self.primary_endpoint_address
    }
  }

  tags = merge(
    local.common_tags,
    tomap({ "Name" = "${local.prefix}-elasticache" })
  )

}
